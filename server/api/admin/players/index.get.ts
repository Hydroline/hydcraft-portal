import {
	getOptionalQueryString,
	getPaginationQuery,
	getSortDirection,
} from '../../../utils/admin/pagination'
import { listAdminMinecraftAccounts } from '../../../utils/admin/players'
import { requireAdminUser } from '../../../utils/auth/session'

export default defineEventHandler(async (event) => {
	await requireAdminUser(event)
	const { query, page, pageSize } = getPaginationQuery(event)

	return await listAdminMinecraftAccounts({
		page,
		pageSize,
		search: getOptionalQueryString(query.search),
		linked: getOptionalQueryString(query.linked),
		group: getOptionalQueryString(query.group),
		totp: getOptionalQueryString(query.totp),
		sortField: getOptionalQueryString(query.sortField),
		sortDirection: getSortDirection(query.sortDirection),
	})
})
