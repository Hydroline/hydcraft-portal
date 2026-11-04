<template>
	<NuxtLink
		:to="localePath('/newspapers')"
		class="relative flex shrink-0 items-center overflow-hidden border border-slate-200 bg-white/80 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sky-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-50"
		:class="
			compact
				? 'h-16 w-full rounded-lg sm:h-20'
				: 'h-44 w-[19rem] rounded-xl sm:h-52 sm:w-[24rem]'
		"
	>
		<div
			class="relative z-10 flex w-1/2 flex-col items-start gap-1 pl-2 sm:gap-4 sm:pl-6"
		>
			<span class="font-arkpixel text-sm sm:text-3xl">{{
				t('newspapers.shortTitle')
			}}</span>
			<span
				class="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 sm:text-sm"
				>{{ t('newspapers.view')
				}}<UIcon name="i-lucide-arrow-right" class="shrink-0"
			/></span>
		</div>
		<img
			v-if="cover"
			:src="cover"
			:alt="t('newspapers.shortTitle')"
			loading="lazy"
			class="absolute top-1/4 right-2 h-full w-[45%] object-cover object-top sm:right-5"
		/>
		<UIcon
			v-else
			name="i-lucide-newspaper"
			class="absolute right-3 bottom-0 size-12 text-slate-300 dark:text-slate-600 sm:right-6 sm:size-32"
			aria-hidden="true"
		/>
	</NuxtLink>
</template>

<script setup lang="ts">
import { newspaperPublications } from '~/data/newspapers'

defineProps<{ compact?: boolean }>()
const { t } = useI18n()
const localePath = useLocalePath()
const covers = newspaperPublications.flatMap((publication) =>
	publication.issues.flatMap((issue) =>
		issue.pages[0] ? [issue.pages[0]] : [],
	),
)
const cover = ref(covers[0])
onMounted(() => {
	cover.value = covers[Math.floor(Math.random() * covers.length)]
})
</script>
