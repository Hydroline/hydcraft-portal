const mediaModules = import.meta.glob<string>(
	'~/assets/media/**/*.{avif,gif,jpeg,jpg,png,svg,webp,mp4,webm}',
	{ eager: true, query: '?url', import: 'default' },
)
const mediaUrls = Object.fromEntries(
	Object.entries(mediaModules).map(([path, url]) => [
		path.replace(/^.*\/assets\/media\//, ''),
		url,
	]),
)

export const getSiteMediaUrl = (path: string): string => {
	const url = mediaUrls[path.replace(/^\/+/, '')]
	if (!url) throw new Error(`SITE_MEDIA_NOT_FOUND: ${path}`)
	return url
}
