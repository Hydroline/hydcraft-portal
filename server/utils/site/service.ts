import { prisma } from '../db/prisma'
import { emitEvent } from '../events/event-bus'
import { normalizeMourningSettings } from './validation'
import {
	createDefaultMourningSettings,
	type MourningSettings,
} from '../../../utils/site/mourning'

const MOURNING_KEY = 'mourning'

export const getMourningSettings = async (): Promise<MourningSettings> => {
	const record = await prisma.siteSetting.findUnique({
		where: { key: MOURNING_KEY },
	})
	return record
		? normalizeMourningSettings(record.value)
		: createDefaultMourningSettings()
}

export const saveMourningSettings = async (
	actorUserId: string,
	input: unknown,
): Promise<MourningSettings> => {
	const settings = normalizeMourningSettings(input)
	const value = {
		...settings,
		dates: settings.dates.map((date) => ({ ...date })),
	}
	const record = await prisma.siteSetting.upsert({
		where: { key: MOURNING_KEY },
		create: { key: MOURNING_KEY, value, updatedBy: actorUserId },
		update: { value, updatedBy: actorUserId },
	})
	await emitEvent('site.settings.updated', {
		key: MOURNING_KEY,
		actorUserId,
		updatedAt: record.updatedAt,
	}).catch((error: unknown) => {
		console.error('SITE_SETTINGS_EVENT_FAILED', error)
	})
	return settings
}
