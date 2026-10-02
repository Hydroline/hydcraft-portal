import { createBadRequestError } from '../errors'
import {
	isValidAnnualDate,
	sortMourningDates,
	type MourningSettings,
} from '../../../utils/site/mourning'

export const normalizeMourningSettings = (input: unknown): MourningSettings => {
	const invalid = () => createBadRequestError('SITE_MOURNING_SETTINGS_INVALID')
	if (!input || typeof input !== 'object' || Array.isArray(input))
		throw invalid()
	const value = input as Record<string, unknown>
	if (
		typeof value.manualEnabled !== 'boolean' ||
		typeof value.automaticEnabled !== 'boolean' ||
		typeof value.grayscale !== 'number' ||
		!Number.isInteger(value.grayscale) ||
		value.grayscale < 0 ||
		value.grayscale > 100 ||
		!Array.isArray(value.dates) ||
		value.dates.length > 100
	)
		throw invalid()
	const ids = new Set<string>()
	const dates = value.dates.map((item: unknown) => {
		if (!item || typeof item !== 'object' || Array.isArray(item))
			throw invalid()
		const date = item as Record<string, unknown>
		if (
			typeof date.id !== 'string' ||
			!/^[a-zA-Z0-9-]{1,64}$/.test(date.id) ||
			ids.has(date.id) ||
			typeof date.name !== 'string' ||
			!date.name.trim() ||
			date.name.trim().length > 100 ||
			typeof date.month !== 'number' ||
			typeof date.day !== 'number' ||
			!isValidAnnualDate(date.month, date.day)
		)
			throw invalid()
		ids.add(date.id)
		return {
			id: date.id,
			name: date.name.trim(),
			month: date.month,
			day: date.day,
		}
	})
	return {
		manualEnabled: value.manualEnabled,
		automaticEnabled: value.automaticEnabled,
		grayscale: value.grayscale,
		dates: sortMourningDates(dates),
	}
}
