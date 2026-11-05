import { lstat, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve, extname, join } from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const write = args.includes('--write')
const inputs = args.filter((arg) => arg !== '--write')
if (!inputs.length || inputs.some((arg) => arg.startsWith('--'))) {
	console.error(
		'Usage: pnpm newspapers:webp [--write] <PNG/JPEG file or directory> [...]',
	)
	process.exit(1)
}

async function collect(path) {
	const stat = await lstat(path)
	if (stat.isSymbolicLink()) return []
	if (stat.isFile()) return /\.(png|jpe?g)$/i.test(path) ? [path] : []
	if (!stat.isDirectory()) return []
	const files = []
	for (const entry of await readdir(path))
		files.push(...(await collect(join(path, entry))))
	return files
}

const files = [
	...new Set(
		(await Promise.all(inputs.map((path) => collect(resolve(path))))).flat(),
	),
].sort()
if (!files.length) throw new Error('SOURCE_IMAGES_NOT_FOUND')
const destinations = new Set()
// Reject PNG/JPEG pairs that would map to the same output before writing anything.
for (const file of files) {
	const output = file.slice(0, -extname(file).length) + '.webp'
	if (destinations.has(output.toLowerCase()))
		throw new Error(`DUPLICATE_WEBP_DESTINATION: ${output}`)
	destinations.add(output.toLowerCase())
}

let originalBytes = 0
let webpBytes = 0
for (const file of files) {
	const original = await readFile(file)
	const metadata = await sharp(original).metadata()
	if (
		!['png', 'jpeg'].includes(metadata.format) ||
		metadata.depth !== 'uchar' ||
		(metadata.pages ?? 1) > 1
	) {
		throw new Error(
			`UNSUPPORTED_SOURCE_IMAGE: ${file} (only static 8-bit PNG/JPEGs are supported)`,
		)
	}
	const encoded = await sharp(original)
		.keepMetadata()
		.webp({ lossless: true, effort: 6 })
		.toBuffer()
	const before = await sharp(original)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true })
	const after = await sharp(encoded)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true })
	if (
		before.info.width !== after.info.width ||
		before.info.height !== after.info.height ||
		!before.data.equals(after.data)
	) {
		throw new Error(`WEBP_PIXEL_VERIFICATION_FAILED: ${file}`)
	}
	const output = file.slice(0, -extname(file).length) + '.webp'
	if (write) await writeFile(output, encoded, { flag: 'wx' })
	originalBytes += original.length
	webpBytes += encoded.length
	console.log(
		`${file}: ${original.length} -> ${encoded.length} bytes (pixels verified)`,
	)
}

console.log(
	JSON.stringify({
		mode: write ? 'write' : 'dry-run',
		files: files.length,
		originalBytes,
		webpBytes,
		savedPercent: Number(((1 - webpBytes / originalBytes) * 100).toFixed(2)),
	}),
)
