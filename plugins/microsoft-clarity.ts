import Clarity from '@microsoft/clarity'

export default defineNuxtPlugin(() => {
	if (import.meta.dev) {
		return
	}

	const clarityProjectId = String(useRuntimeConfig().public.msClarityId || '')

	if (!clarityProjectId) {
		return
	}

	Clarity.init(clarityProjectId)
})
