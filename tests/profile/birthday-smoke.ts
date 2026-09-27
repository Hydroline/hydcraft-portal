import assert from 'node:assert/strict'
import { resolveBirthdaySummary } from '../../utils/profile/birthday'

const summary = (
	birthday: string | null,
	now: string,
	zone = 'Asia/Shanghai',
) => resolveBirthdaySummary(birthday, zone, new Date(now))

assert.equal(
	summary('2000-09-27T00:00:00.000Z', '2026-09-26T16:00:00Z')
		?.daysUntilNextBirthday,
	0,
)
assert.equal(
	summary('2000-09-27', '2026-09-26T15:59:59Z')?.daysUntilNextBirthday,
	1,
)
assert.equal(
	summary('2000-09-27', '2026-09-27T16:00:00Z')?.daysSinceLastBirthday,
	1,
)
assert.equal(
	summary('2000-09-27', '2026-09-27T01:00:00Z', 'America/Los_Angeles')
		?.daysUntilNextBirthday,
	1,
)
assert.equal(
	summary('2000-02-29', '2027-03-01T00:00:00Z')?.daysUntilNextBirthday,
	0,
)
assert.equal(
	summary('2000-02-29', '2028-02-29T00:00:00Z')?.daysUntilNextBirthday,
	0,
)
assert.equal(
	summary('2000-02-29', '2027-03-02T00:00:00Z')?.daysUntilNextBirthday,
	364,
)
assert.equal(
	summary('2000-02-29', '2029-02-28T00:00:00Z')?.daysSinceLastBirthday,
	365,
)
assert.equal(summary(null, '2026-09-27T00:00:00Z'), null)
assert.equal(summary('invalid', '2026-09-27T00:00:00Z'), null)
assert.equal(summary('2000-02-30', '2026-09-27T00:00:00Z'), null)
assert.equal(summary('2030-09-27', '2026-09-27T00:00:00Z'), null)
assert.equal(
	summary('2000-09-27', '2026-09-26T16:00:00Z', 'invalid')
		?.daysUntilNextBirthday,
	0,
)
console.log('Birthday timezone and leap-day checks passed')
