<template>
	<NuxtLink
		:to="localePath('/server/newspapers')"
		class="h-44 w-full rounded-xl sm:h-52 relative flex shrink-0 items-center overflow-hidden border border-slate-200 bg-white/80 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sky-400 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-50"
	>
		<div class="relative z-10 flex w-1/2 flex-col items-start gap-4 pl-6">
			<span class="font-arkpixel text-2xl sm:text-3xl">{{
				t('newspapers.shortTitle')
			}}</span>
			<span
				class="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"
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

const { t } = useI18n()
const localePath = useLocalePath()
const covers = newspaperPublications.flatMap((publication) =>
	publication.issues.flatMap((issue) =>
		issue.pages[0] ? [issue.coverSrc ?? issue.pages[0]] : [],
	),
)
const cover = ref(covers[0])
onMounted(() => {
	cover.value = covers[Math.floor(Math.random() * covers.length)]
})
</script>
