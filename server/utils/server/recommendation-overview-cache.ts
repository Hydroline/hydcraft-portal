import type { H3Event } from 'h3'
import type {
	ServerOverviewRecommendedPlayer,
	ServerOverviewRecommendedUser,
} from '../../../utils/server/overview'
import {
	readManagedCache,
	refreshManagedCache,
} from '../cache/memory-cache-manager'
import { listRecommendedPlayers } from './recommended-players'
import { listRecommendedUsers } from './recommended-users'
import { withRecommendationRefreshBudget } from './recommendation-guard'

export interface ServerOverviewRecommendations {
	recommendedUsers: ServerOverviewRecommendedUser[]
	recommendedPlayers: ServerOverviewRecommendedPlayer[]
}

const CACHE_NAMESPACE = 'server-overview-recommendations'
const CACHE_KEY = 'default'
// Share the default SSR batch so repeated overview GETs do not rerun DB queries.
const CACHE_TTL_MS = 10_000
const MAX_STALE_AGE_MS = 60_000

export const getServerOverviewRecommendations = async (
	event: H3Event,
): Promise<ServerOverviewRecommendations> => {
	const cached = readManagedCache<ServerOverviewRecommendations>({
		namespace: CACHE_NAMESPACE,
		key: CACHE_KEY,
	})

	if (cached.isFresh && cached.entry) {
		return cached.entry.data
	}
	const staleFallback =
		cached.entry && Date.now() - cached.entry.updatedAt <= MAX_STALE_AGE_MS
			? cached.entry.data
			: null

	try {
		await refreshManagedCache({
			namespace: CACHE_NAMESPACE,
			key: CACHE_KEY,
			ttlMs: CACHE_TTL_MS,
			maxEntries: 1,
			silent: true,
			onError: (error) => {
				if (
					error &&
					typeof error === 'object' &&
					'statusCode' in error &&
					error.statusCode === 429
				) {
					return
				}

				console.warn('RECOMMENDATION_CACHE_REFRESH_FAILED', error)
			},
			loader: () =>
				withRecommendationRefreshBudget(event, async () => {
					const [recommendedUsers, recommendedPlayers] = await Promise.all([
						listRecommendedUsers(),
						listRecommendedPlayers(),
					])

					return { recommendedUsers, recommendedPlayers }
				}),
		})
	} catch (error) {
		if (staleFallback) {
			return staleFallback
		}

		throw error
	}

	const refreshed = readManagedCache<ServerOverviewRecommendations>({
		namespace: CACHE_NAMESPACE,
		key: CACHE_KEY,
	})

	if (!refreshed.entry) {
		throw new Error('Recommendation cache refresh produced no value')
	}

	return refreshed.entry.data
}
