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

export const listRecommendedUsers = async (): Promise<
	ServerOverviewRecommendedUser[]
> => {
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

	return pickRandomItems(
		users
			.filter((user) => isPublicProfileCandidate(user.privacy))
			.map((user) => ({
				username: user.username,
				displayName: user.displayName,
				avatarUrl: user.avatarUrl,
				coverUrl: user.coverUrl,
				bio: user.bio,
			})),
		10,
	)
}
