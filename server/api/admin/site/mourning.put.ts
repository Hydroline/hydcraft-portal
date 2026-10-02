import { requireAdminUser } from '../../../utils/auth/session'
import { saveMourningSettings } from '../../../utils/site/service'

export default defineEventHandler(async (event) => {
	const actor = await requireAdminUser(event)
	return await saveMourningSettings(actor.id, await readBody(event))
})
