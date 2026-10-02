import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type PageContainerVariant =
	| 'auth'
	| 'fullBleed'
	| 'immersive'
	| 'minecraftAccounts'

export type HeaderVariant = 'hero' | 'minecraftAccounts' | 'solid'
export type PageBackground = 'none' | 'map'

declare module '#app' {
	interface PageMeta {
		pageBackground?: PageBackground
	}
}

declare module 'vue-router' {
	interface RouteMeta {
		pageBackground?: PageBackground
	}
}

const readQueryValue = (value: unknown): string | null => {
	if (typeof value === 'string') {
		return value
	}

	if (Array.isArray(value) && typeof value[0] === 'string') {
		return value[0]
	}

	return null
}

export const isMinecraftAccountsImmersiveView = (
	route: Pick<RouteLocationNormalizedLoaded, 'meta' | 'query'>,
): boolean =>
	route.meta.pageContainerVariant === 'minecraftAccounts' &&
	readQueryValue(route.query.view) !== 'list'

export const resolvePageBackground = (
	route: Pick<RouteLocationNormalizedLoaded, 'meta' | 'query'>,
): PageBackground => {
	if (
		route.meta.pageContainerVariant === 'minecraftAccounts' &&
		!isMinecraftAccountsImmersiveView(route)
	) {
		return 'none'
	}

	return route.meta.pageBackground ?? 'none'
}

export const resolvePageContainerVariant = (
	route: RouteLocationNormalizedLoaded,
): Exclude<PageContainerVariant, 'minecraftAccounts'> | undefined => {
	const variant = route.meta.pageContainerVariant as
		| PageContainerVariant
		| undefined

	if (variant === 'minecraftAccounts') {
		return isMinecraftAccountsImmersiveView(route) ? 'immersive' : undefined
	}

	return variant
}

export const resolveHeaderVariant = (
	route: RouteLocationNormalizedLoaded,
): Exclude<HeaderVariant, 'minecraftAccounts'> | undefined => {
	const variant = route.meta.headerVariant as HeaderVariant | undefined

	if (variant === 'minecraftAccounts') {
		return isMinecraftAccountsImmersiveView(route) ? 'hero' : 'solid'
	}

	return variant
}
