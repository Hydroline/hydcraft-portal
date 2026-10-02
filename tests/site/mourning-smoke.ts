import assert from 'node:assert/strict'
import {
	createDefaultMourningSettings,
	isValidAnnualDate,
	resolveSiteAppearance,
	sortMourningDates,
} from '../../utils/site/mourning'
import { normalizeMourningSettings } from '../../server/utils/site/validation'

const settings = createDefaultMourningSettings()
settings.dates = [
	{ id: 'december', name: 'December', month: 12, day: 13 },
	{ id: 'january', name: 'January', month: 1, day: 1 },
	{ id: 'april', name: 'April', month: 4, day: 4 },
	{ id: 'leap', name: 'Leap day', month: 2, day: 29 },
]
assert.deepEqual(
	sortMourningDates(settings.dates).map((date) => date.id),
	['january', 'leap', 'april', 'december'],
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2026-12-12T15:59:59Z')).active,
	false,
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2026-12-12T16:00:00Z')).active,
	true,
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2026-12-13T16:00:00Z')).active,
	false,
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2027-12-12T16:00:00Z')).active,
	true,
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2028-02-29T00:00:00Z')).active,
	true,
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2027-03-01T00:00:00Z')).active,
	false,
)
assert.equal(
	resolveSiteAppearance(settings, new Date('2026-12-12T15:59:59Z'))
		.nextCheckInMs,
	1100,
)
assert.equal(
	resolveSiteAppearance(
		{ ...settings, automaticEnabled: false },
		new Date('2026-12-13T00:00:00Z'),
	).active,
	false,
)
assert.deepEqual(
	resolveSiteAppearance(
		{ ...settings, manualEnabled: true, grayscale: 65 },
		new Date('2026-06-01T00:00:00Z'),
	),
	{ active: true, grayscale: 65, nextCheckInMs: 60000 },
)
assert.equal(
	resolveSiteAppearance(createDefaultMourningSettings()).active,
	false,
)
assert.equal(isValidAnnualDate(2, 29), true)
assert.equal(isValidAnnualDate(2, 30), false)
assert.equal(isValidAnnualDate(4, 31), false)
assert.equal(isValidAnnualDate(0, 1), false)
assert.equal(isValidAnnualDate(1, 0), false)
assert.equal(isValidAnnualDate(13, 1), false)
assert.equal(isValidAnnualDate(1.5, 1), false)
assert.equal(normalizeMourningSettings(settings).dates[0]?.month, 1)
assert.equal(
	normalizeMourningSettings({
		...settings,
		dates: [{ id: 'rename', name: ' New name ', month: 4, day: 4 }],
	}).dates[0]?.name,
	'New name',
)
for (const invalid of [
	null,
	{},
	{ ...settings, manualEnabled: 'true' },
	{ ...settings, grayscale: -1 },
	{ ...settings, grayscale: 101 },
	{ ...settings, grayscale: NaN },
	{ ...settings, grayscale: 0.5 },
	{ ...settings, dates: [{ id: 'bad', name: '', month: 1, day: 1 }] },
	{ ...settings, dates: [{ id: 'bad', name: 'Invalid', month: 2, day: 30 }] },
	{ ...settings, dates: [settings.dates[0], settings.dates[0]] },
	{ ...settings, dates: Array(101).fill(settings.dates[0]) },
]) {
	assert.throws(() => normalizeMourningSettings(invalid), {
		statusCode: 400,
		statusMessage: 'SITE_MOURNING_SETTINGS_INVALID',
	})
}
console.log(
	'Mourning calendar, grayscale, sorting, renaming and validation checks passed',
)
