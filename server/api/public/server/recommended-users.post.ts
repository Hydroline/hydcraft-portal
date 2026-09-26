import { createBadRequestError } from '../../../utils/errors'
import { listRecommendedUsers } from '../../../utils/server/recommended-users'

interface RecommendedUsersRequest {
	currentUsernames: string[]
	seenUsernames: string[]
}

const isUsernameList = (value: unknown, limit: number): value is string[] =>
	Array.isArray(value) &&
	value.length <= limit &&
	value.every((item) => typeof item === 'string' && item.length <= 64)

export default defineEventHandler(async (event) => {
	const body: unknown = await readBody(event)
	if (!body || typeof body !== 'object') {
		throw createBadRequestError('INVALID_RECOMMENDED_USERS_REQUEST')
	}

	const request = body as Partial<RecommendedUsersRequest>
	if (
		!isUsernameList(request.currentUsernames, 10) ||
		!isUsernameList(request.seenUsernames, 2000)
	) {
		throw createBadRequestError('INVALID_RECOMMENDED_USERS_REQUEST')
	}

	return listRecommendedUsers(request as RecommendedUsersRequest)
})
