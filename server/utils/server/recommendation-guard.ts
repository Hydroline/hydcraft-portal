import { setResponseHeader, type H3Event } from 'h3'
import { createApiError } from '../errors'

const MAX_CONCURRENT_REQUESTS = 3
const MAX_BURST_REQUESTS = 12
const REFILL_INTERVAL_MS = 1000

let activeRequests = 0
let availableRequests = MAX_BURST_REQUESTS
let lastRefillAt = Date.now()

export const withRecommendationRefreshBudget = async <T>(
	event: H3Event,
	work: () => Promise<T>,
): Promise<T> => {
	const now = Date.now()
	const elapsedIntervals = Math.floor((now - lastRefillAt) / REFILL_INTERVAL_MS)
	if (elapsedIntervals > 0) {
		availableRequests = Math.min(
			MAX_BURST_REQUESTS,
			availableRequests + elapsedIntervals,
		)
		lastRefillAt += elapsedIntervals * REFILL_INTERVAL_MS
	}

	if (availableRequests < 1 || activeRequests >= MAX_CONCURRENT_REQUESTS) {
		setResponseHeader(event, 'Retry-After', 2)
		throw createApiError({
			statusCode: 429,
			code: 'RECOMMENDATION_RATE_LIMITED',
		})
	}

	availableRequests -= 1
	activeRequests += 1
	try {
		return await work()
	} finally {
		activeRequests -= 1
	}
}
