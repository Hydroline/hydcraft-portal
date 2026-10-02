export interface MourningDate {
	id: string
	name: string
	month: number
	day: number
}

export interface MourningSettings {
	manualEnabled: boolean
	automaticEnabled: boolean
	grayscale: number
	dates: MourningDate[]
}

export interface SiteAppearance {
	active: boolean
	grayscale: number
	nextCheckInMs: number
}

export const createDefaultMourningSettings = (): MourningSettings => ({
	manualEnabled: false,
	automaticEnabled: true,
	grayscale: 100,
	dates: [],
})

export const sortMourningDates = (dates: MourningDate[]) =>
	[...dates].sort(
		(a, b) => a.month - b.month || a.day - b.day || a.id.localeCompare(b.id),
	)

export const isValidAnnualDate = (month: number, day: number): boolean => {
	if (!Number.isInteger(month) || !Number.isInteger(day)) return false
	const date = new Date(Date.UTC(2000, month - 1, day))
	return date.getUTCMonth() + 1 === month && date.getUTCDate() === day
}

// Site-wide observances use a single calendar, regardless of visitor timezone.
export const resolveSiteAppearance = (
	settings: MourningSettings,
	now = new Date(),
): SiteAppearance => {
	const shanghai = new Date(now.getTime() + 8 * 60 * 60 * 1000)
	const month = shanghai.getUTCMonth() + 1
	const day = shanghai.getUTCDate()
	const active =
		settings.manualEnabled ||
		(settings.automaticEnabled &&
			settings.dates.some((date) => date.month === month && date.day === day))
	const midnight =
		Date.UTC(shanghai.getUTCFullYear(), shanghai.getUTCMonth(), day + 1) -
		8 * 60 * 60 * 1000
	return {
		active,
		grayscale: active ? settings.grayscale : 0,
		nextCheckInMs: Math.min(60_000, midnight - now.getTime() + 100),
	}
}
