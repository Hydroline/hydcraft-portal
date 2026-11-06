import {
	lstat,
	readdir,
	readFile,
	rename,
	writeFile,
	unlink,
} from 'node:fs/promises'
import { resolve, extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'

// No resizing or palette quantization. Only replace a file after verifying
// that the decoded RGBA pixels are identical and the encoded file is smaller.
const args = process.argv.slice(2)
const write = args.includes('--write')
const inputs = args.filter((arg) => arg !== '--write')
if (!inputs.length || inputs.some((arg) => arg.startsWith('--'))) {
	console.error(
		'Usage: pnpm newspapers:optimize [--write] <PNG file or directory> [...]',
	)
	process.exit(1)
}

async function collect(path) {
	const stat = await lstat(path)
	if (stat.isSymbolicLink()) return []
	if (stat.isFile()) return extname(path).toLowerCase() === '.png' ? [path] : []
	if (!stat.isDirectory()) return []
	const files = []
	for (const entry of await readdir(path))
		files.push(...(await collect(join(path, entry))))
	return files
}

async function decode(buffer) {
	return sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

let originalBytes = 0
let optimizedBytes = 0
let changed = 0
const files = [
	...new Set(
		(await Promise.all(inputs.map((path) => collect(resolve(path))))).flat(),
	),
].sort()
if (!files.length) throw new Error('PNG_FILES_NOT_FOUND')

for (const file of files) {
	const original = await readFile(file)
	const metadata = await sharp(original).metadata()
	if (
		metadata.format !== 'png' ||
		metadata.depth !== 'uchar' ||
		(metadata.pages ?? 1) > 1
	) {
		throw new Error(
			`UNSUPPORTED_PNG_FORMAT: ${file} (only static 8-bit PNGs are supported)`,
		)
	}
	let best = original
	for (const adaptiveFiltering of [false, true]) {
		const candidate = await sharp(original)
			.keepMetadata()
			.png({
				compressionLevel: 9,
				adaptiveFiltering,
				palette: false,
			})
			.toBuffer()
		if (candidate.length < best.length) best = candidate
	}
	if (best !== original) {
		const before = await decode(original)
		const after = await decode(best)
		if (
			before.info.width !== after.info.width ||
			before.info.height !== after.info.height ||
			!before.data.equals(after.data)
		) {
			throw new Error(`PNG_PIXEL_VERIFICATION_FAILED: ${file}`)
		}
		if (write) {
			const temporary = `${file}.${randomUUID()}.tmp`
			try {
				await writeFile(temporary, best, { flag: 'wx' })
				await rename(temporary, file)
			} finally {
				await unlink(temporary).catch((error) => {
					if (error.code !== 'ENOENT') throw error
				})
			}
		}
		changed++
	}
	originalBytes += original.length
	optimizedBytes += best.length
	console.log(
		`${file}: ${original.length} -> ${best.length} bytes${best !== original ? ' (pixels verified)' : ' (unchanged)'}`,
	)
}

console.log(
	JSON.stringify({
		mode: write ? 'write' : 'dry-run',
		files: files.length,
		changed,
		originalBytes,
		optimizedBytes,
		savedPercent: Number(
			((1 - optimizedBytes / originalBytes) * 100).toFixed(2),
		),
	}),
)
