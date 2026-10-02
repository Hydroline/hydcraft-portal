import type { RouterConfig } from '@nuxt/schema'
import {
	clearPendingScrollRestore,
	getScrollRouteKey,
	getScrollSnapshot,
	isHomeScrollPath,
	normalizeScrollPath,
	queueAbsoluteScrollRestore,
	queueProgressScrollRestore,
	saveScrollSnapshot,
	waitForPageLeave,
} from '../utils/scroll'

const HASH_SCROLL_RETRY_INTERVAL_MS = 50
const HASH_SCROLL_TIMEOUT_MS = 2000
const HASH_SCROLL_HEADER_GAP_PX = 24

const waitForHashScrollPosition = async (hash: string) => {
	if (!import.meta.client) {
		return { el: hash, behavior: 'smooth' as const }
	}

	const targetId = decodeURIComponent(hash.slice(1))
	const expiresAt = window.performance.now() + HASH_SCROLL_TIMEOUT_MS
	let target = document.getElementById(targetId)

	while (!target && window.performance.now() < expiresAt) {
		await new Promise<void>((resolve) => {
			window.setTimeout(resolve, HASH_SCROLL_RETRY_INTERVAL_MS)
		})
		target = document.getElementById(targetId)
	}

	if (!target) {
		return { el: hash, behavior: 'smooth' as const }
	}

	const header = document.querySelector<HTMLElement>('[data-page-header]')
	const headerHeight = header?.getBoundingClientRect().height ?? 0

	return {
		left: 0,
		top: Math.max(
			window.scrollY +
				target.getBoundingClientRect().top -
				headerHeight -
				HASH_SCROLL_HEADER_GAP_PX,
			0,
		),
		behavior: 'smooth' as const,
	}
}

export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		const leavingImmersivePage =
			import.meta.client &&
			normalizeScrollPath(from.fullPath) !== normalizeScrollPath(to.fullPath) &&
			(isHomeScrollPath(from.fullPath) ||
				/^\/players\/[^/]+$/.test(normalizeScrollPath(from.fullPath)))
		const afterPageLeave = <T>(position: T): T | Promise<T> =>
			leavingImmersivePage ? waitForPageLeave().then(() => position) : position

		if (savedPosition) {
			clearPendingScrollRestore()
			return afterPageLeave(savedPosition)
		}

		if (to.hash) {
			clearPendingScrollRestore()
			return leavingImmersivePage
				? waitForPageLeave().then(() => waitForHashScrollPosition(to.hash))
				: waitForHashScrollPosition(to.hash)
		}

		if (!import.meta.client) {
			return { left: 0, top: 0 }
		}

		saveScrollSnapshot(from.fullPath)

		const fromNormalizedPath = normalizeScrollPath(from.fullPath)
		const toNormalizedPath = normalizeScrollPath(to.fullPath)
		const isLocaleSwitchWithinSamePage =
			fromNormalizedPath === toNormalizedPath &&
			getScrollRouteKey(from.fullPath) !== getScrollRouteKey(to.fullPath)

		if (isLocaleSwitchWithinSamePage) {
			const fromSnapshot = getScrollSnapshot(from.fullPath)

			if (fromSnapshot) {
				queueProgressScrollRestore(to.fullPath, fromSnapshot.progress)
				return afterPageLeave({ left: 0, top: fromSnapshot.top })
			}
		}

		if (isHomeScrollPath(to.fullPath)) {
			clearPendingScrollRestore()
			return afterPageLeave({ left: 0, top: 0 })
		}

		const savedSnapshot = getScrollSnapshot(to.fullPath)

		if (savedSnapshot) {
			if (leavingImmersivePage) {
				return waitForPageLeave().then(() => {
					queueAbsoluteScrollRestore(to.fullPath, savedSnapshot.top)
					return false
				})
			}
			queueAbsoluteScrollRestore(to.fullPath, savedSnapshot.top)
			return false
		}

		clearPendingScrollRestore()
		return afterPageLeave({ left: 0, top: 0 })
	},
}
