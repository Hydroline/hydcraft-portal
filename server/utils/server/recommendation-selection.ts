export interface RecommendationSelection {
	currentKeys?: string[]
	seenKeys?: string[]
}

export const shuffleRecommendations = <T>(items: T[]): T[] => {
	const shuffled = [...items]

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1))
		const currentItem = shuffled[index]
		shuffled[index] = shuffled[randomIndex]!
		shuffled[randomIndex] = currentItem!
	}

	return shuffled
}

export const prioritizeRecommendations = <T>(
	items: T[],
	keyOf: (item: T) => string,
	selection: RecommendationSelection,
): T[] => {
	if (!selection.currentKeys?.length) return shuffleRecommendations(items)

	const current = new Set(selection.currentKeys)
	const seen = new Set(selection.seenKeys)
	return [
		...shuffleRecommendations(
			items.filter(
				(item) => !current.has(keyOf(item)) && !seen.has(keyOf(item)),
			),
		),
		...shuffleRecommendations(
			items.filter(
				(item) => !current.has(keyOf(item)) && seen.has(keyOf(item)),
			),
		),
		...shuffleRecommendations(items.filter((item) => current.has(keyOf(item)))),
	]
}
