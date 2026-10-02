import { prisma } from '../db/prisma'
import { resolveDisplayTimezone } from '../profile/mapper'
import { resolveBirthdaySummary } from '../../../utils/profile/birthday'
import { isPublicProfileCandidate } from './public-overview'
import {
	prioritizeRecommendations,
	type RecommendationSelection,
} from './recommendation-selection'
import type { ServerOverviewRecommendedUser } from '../../../utils/server/overview'

export const listRecommendedUsers = async (
	selection: RecommendationSelection = {},
): Promise<ServerOverviewRecommendedUser[]> => {
	const users = await prisma.user.findMany({
		select: {
			username: true,
			displayName: true,
			avatarUrl: true,
			coverUrl: true,
			bio: true,
			birthday: true,
			countryOrRegion: true,
			preferences: { select: { timezoneMode: true, timezone: true } },
			privacy: {
				select: {
					publicProfile: true,
					showBirthday: true,
					searchableInUserDirectory: true,
				},
			},
		},
	})

	const candidates = users.filter((user) =>
		isPublicProfileCandidate(user.privacy),
	)
	const now = new Date()
	return prioritizeRecommendations(
		candidates,
		(user) => user.username,
		selection,
	)
		.slice(0, 10)
		.map((user) => ({
			username: user.username,
			displayName: user.displayName,
			avatarUrl: user.avatarUrl,
			coverUrl: user.coverUrl,
			bio: user.bio,
			isBirthdayToday:
				(user.privacy?.showBirthday ?? true) &&
				resolveBirthdaySummary(user.birthday, resolveDisplayTimezone(user), now)
					?.daysUntilNextBirthday === 0,
		}))
}
