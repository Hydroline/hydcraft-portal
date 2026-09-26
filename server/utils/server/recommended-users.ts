import { prisma } from '../db/prisma'
import { isPublicProfileCandidate } from './public-overview'
import type { ServerOverviewRecommendedUser } from '../../../utils/server/overview'

const shuffle = <T>(items: T[]): T[] => {
	const shuffled = [...items]

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1))
		const currentItem = shuffled[index]
		shuffled[index] = shuffled[randomIndex]!
		shuffled[randomIndex] = currentItem!
	}

	return shuffled
}

const pickRandomItems = <T>(items: T[], limit: number): T[] =>
	shuffle(items).slice(0, limit)

export interface RecommendedUserSelection {
	currentUsernames?: string[]
	seenUsernames?: string[]
}

export const listRecommendedUsers = async (
	selection: RecommendedUserSelection = {},
): Promise<ServerOverviewRecommendedUser[]> => {
	const users = await prisma.user.findMany({
		select: {
			username: true,
			displayName: true,
			avatarUrl: true,
			coverUrl: true,
			bio: true,
			privacy: {
				select: {
					publicProfile: true,
					searchableInUserDirectory: true,
				},
			},
		},
	})

	const candidates = users
		.filter((user) => isPublicProfileCandidate(user.privacy))
		.map((user) => ({
			username: user.username,
			displayName: user.displayName,
			avatarUrl: user.avatarUrl,
			coverUrl: user.coverUrl,
			bio: user.bio,
		}))

	if (!selection.currentUsernames?.length)
		return pickRandomItems(candidates, 10)

	const current = new Set(selection.currentUsernames)
	const seen = new Set(selection.seenUsernames)
	const unseen = candidates.filter(
		(user) => !current.has(user.username) && !seen.has(user.username),
	)
	const previouslySeen = candidates.filter(
		(user) => !current.has(user.username) && seen.has(user.username),
	)
	const currentCandidates = candidates.filter((user) =>
		current.has(user.username),
	)

	return [
		...shuffle(unseen),
		...shuffle(previouslySeen),
		...shuffle(currentCandidates),
	].slice(0, 10)
}
