<script setup lang="ts">
import type { SiteAppearance } from '~/utils/site/mourning'

const { data, error, refresh } = await useFetch<SiteAppearance>(
	'/api/public/site/appearance',
	{
		key: 'site-appearance',
		timeout: 5000,
		default: () => ({ active: false, grayscale: 0, nextCheckInMs: 60_000 }),
	},
)
const route = useRoute()
let timer: ReturnType<typeof setTimeout> | undefined
let disposed = false

function schedule() {
	clearTimeout(timer)
	if (!disposed && !document.hidden) {
		timer = setTimeout(
			update,
			error.value ? 60_000 : Math.max(100, data.value.nextCheckInMs),
		)
	}
}

async function update() {
	if (disposed || document.hidden) return
	await refresh()
	schedule()
}

function onVisibilityChange() {
	clearTimeout(timer)
	if (!document.hidden) void update()
}

onMounted(() => {
	schedule()
	document.addEventListener('visibilitychange', onVisibilityChange)
})
watch(
	() => route.path,
	() => {
		if (import.meta.client) void update()
	},
)
onBeforeUnmount(() => {
	disposed = true
	clearTimeout(timer)
	document.removeEventListener('visibilitychange', onVisibilityChange)
})

useHead(() => ({
	htmlAttrs: {
		class: data.value.active ? 'site-mourning' : undefined,
		style: data.value.active
			? `--site-grayscale: ${data.value.grayscale}%`
			: undefined,
	},
}))
</script>

<template><span class="hidden" aria-hidden="true" /></template>

<style>
html.site-mourning {
	filter: grayscale(var(--site-grayscale, 100%));
}
</style>
