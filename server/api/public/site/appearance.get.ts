import { getMourningSettings } from '../../../utils/site/service'
import { resolveSiteAppearance } from '../../../../utils/site/mourning'

export default defineEventHandler(async (event) => {
	setHeader(event, 'Cache-Control', 'no-store')
	return resolveSiteAppearance(await getMourningSettings())
})
