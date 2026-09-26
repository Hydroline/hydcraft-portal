import { listRecommendedUsers } from '../../../utils/server/recommended-users'
import { listRecommendedPlayers } from '../../../utils/server/recommended-players'
import type { ServerOverviewResponse } from '../../../../utils/server/overview'
import {
	countPublicHistoricalOverviewPlayers,
	countPublicOverviewPlayers,
	countPublicOverviewUsers,
	listPublicOverviewServers,
	resolvePublicOverviewDefaultServerId,
} from '../../../utils/server/public-overview'

export default defineEventHandler(async (): Promise<ServerOverviewResponse> => {
	const serverItems = await listPublicOverviewServers()
	const [
		recommendedUsers,
		recommendedPlayers,
		totalUsers,
		totalPlayers,
		historicalPlayersCount,
	] = await Promise.all([
		listRecommendedUsers(),
		listRecommendedPlayers(),
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
		recommendedUsers,
		recommendedPlayers,
	}
})
