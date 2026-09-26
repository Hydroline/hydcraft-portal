import { listRecommendedPlayers } from '../../../utils/server/recommended-players'
import { readRecommendationSelection } from '../../../utils/server/recommendation-request'
import { withRecommendationRefreshBudget } from '../../../utils/server/recommendation-guard'

export default defineEventHandler((event) =>
	withRecommendationRefreshBudget(event, async () =>
		listRecommendedPlayers(await readRecommendationSelection(event)),
	),
)
