import { requireAdminUser } from '../../../utils/auth/session'
import { getMourningSettings } from '../../../utils/site/service'

export default defineEventHandler(async (event) => {
	await requireAdminUser(event)
	setHeader(event, 'Cache-Control', 'no-store')
	return await getMourningSettings()
})
