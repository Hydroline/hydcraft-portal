import { listRecommendedUsers } from '../../../utils/server/recommended-users'
import { readRecommendationSelection } from '../../../utils/server/recommendation-request'
import { withRecommendationRefreshBudget } from '../../../utils/server/recommendation-guard'

export default defineEventHandler((event) =>
	withRecommendationRefreshBudget(event, async () =>
		listRecommendedUsers(await readRecommendationSelection(event)),
	),
)
