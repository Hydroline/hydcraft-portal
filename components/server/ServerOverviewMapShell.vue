<template>
	<component
		:is="openTo ? 'a' : 'div'"
		:href="openTo || undefined"
		:target="openTo ? '_blank' : undefined"
		:rel="openTo ? 'noopener noreferrer' : undefined"
		class="group block overflow-hidden rounded-xl border border-slate-200 bg-white text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:outline-slate-400"
	>
		<div class="relative isolate overflow-hidden" :class="bodyClass">
			<div
				class="pointer-events-none absolute inset-0 -z-10"
				aria-hidden="true"
			>
				<slot />
			</div>
			<div
				class="pointer-events-none absolute inset-0 bg-slate-950/4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none dark:bg-black/15"
				aria-hidden="true"
			/>
			<div
				class="pointer-events-none relative z-10 flex h-full max-w-[58%] flex-col justify-between gap-4 p-5 sm:p-6"
			>
				<h3
					class="font-arkpixel text-lg leading-6 text-slate-900 dark:text-slate-50"
				>
					{{ title }}
				</h3>
				<span
					v-if="openTo"
					class="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors duration-200 group-hover:text-slate-900 motion-reduce:transition-none dark:text-slate-400 dark:group-hover:text-slate-100"
				>
					{{ openLabel }}
					<UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
				</span>
			</div>
		</div>
	</component>
</template>

<script setup lang="ts">
interface Props {
	title: string
	openLabel: string
	openTo?: string | null
	bodyClass?: string
}

withDefaults(defineProps<Props>(), {
	openTo: null,
	bodyClass: 'h-42',
})
</script>
