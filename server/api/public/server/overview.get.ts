import { getServerOverviewRecommendations } from '../../../utils/server/recommendation-overview-cache'
import type { ServerOverviewResponse } from '../../../../utils/server/overview'
import {
	countPublicHistoricalOverviewPlayers,
	countPublicOverviewPlayers,
	countPublicOverviewUsers,
	listPublicOverviewServers,
	resolvePublicOverviewDefaultServerId,
} from '../../../utils/server/public-overview'

export default defineEventHandler(
	async (event): Promise<ServerOverviewResponse> => {
		const serverItems = await listPublicOverviewServers()
		const [recommendations, totalUsers, totalPlayers, historicalPlayersCount] =
			await Promise.all([
				getServerOverviewRecommendations(event),
				countPublicOverviewUsers(),
				countPublicOverviewPlayers(),
				countPublicHistoricalOverviewPlayers(),
			])

		return {
			servers: serverItems,
			defaultServerId: resolvePublicOverviewDefaultServerId(serverItems),
			totalUsers,
			totalPlayers,
			historicalPlayersCount,
			...recommendations,
		}
	},
)
