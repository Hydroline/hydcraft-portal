import { readBody, type H3Event } from 'h3'
import { createBadRequestError } from '../errors'
import type { RecommendationSelection } from './recommendation-selection'

const isKeyList = (value: unknown, limit: number): value is string[] =>
	Array.isArray(value) &&
	value.length <= limit &&
	value.every((item) => typeof item === 'string' && item.length <= 64)

export const readRecommendationSelection = async (
	event: H3Event,
): Promise<RecommendationSelection> => {
	const body: unknown = await readBody(event)
	if (!body || typeof body !== 'object') {
		throw createBadRequestError('INVALID_RECOMMENDATION_REQUEST')
	}

	const request = body as Record<string, unknown>
	if (
		!isKeyList(request.currentKeys, 10) ||
		!isKeyList(request.seenKeys, 500)
	) {
		throw createBadRequestError('INVALID_RECOMMENDATION_REQUEST')
	}

	return {
		currentKeys: request.currentKeys,
		seenKeys: request.seenKeys,
	}
}
