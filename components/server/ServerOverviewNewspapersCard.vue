<template>
	<ServerOverviewDirectoryShell :title="t('newspapers.title')">
		<NuxtLink
			:to="localePath('/server/newspapers')"
			class="group relative isolate grid overflow-hidden rounded-xl border border-slate-200 bg-stone-50 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:grid-cols-[1fr_1.1fr] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
		>
			<div
				class="relative z-10 flex flex-col items-start px-7 pt-8 pb-5 sm:px-10 sm:pt-10 md:py-12"
			>
				<p
					class="mb-6 w-full border-t border-slate-400/60 pt-3 text-xs tracking-widest text-slate-500 dark:border-slate-600 dark:text-slate-400"
				>
					{{
						t('newspapers.archiveSummary', {
							publications: newspaperPublications.length,
							issues: issueCount,
						})
					}}
				</p>
				<h3
					class="max-w-sm whitespace-pre-line font-serif text-4xl leading-snug tracking-wide sm:text-5xl"
				>
					{{ t('newspapers.archiveHeadline') }}
				</h3>
				<p
					class="mt-5 max-w-sm font-serif text-sm leading-7 text-slate-600 dark:text-slate-400"
				>
					{{ publicationTitles }}
				</p>
				<span
					class="mt-8 inline-flex items-center gap-3 border-b border-slate-400/70 pb-1.5 font-serif text-sm text-slate-700 transition-colors group-hover:text-slate-950 dark:border-slate-600 dark:text-slate-300 dark:group-hover:text-white"
				>
					{{ t('newspapers.view') }}
					<UIcon
						name="i-lucide-arrow-right"
						class="size-4"
						aria-hidden="true"
					/>
				</span>
			</div>
			<div
				class="relative min-h-64 overflow-hidden sm:min-h-80 md:min-h-96"
				aria-hidden="true"
			>
				<div
					class="absolute inset-x-8 bottom-0 h-px bg-slate-300 dark:bg-slate-700"
				/>
				<img
					v-for="(cover, index) in covers"
					:key="cover.id"
					:src="cover.src"
					alt=""
					loading="lazy"
					decoding="async"
					class="absolute top-8 w-40 border border-stone-300 bg-white shadow-xl sm:w-52 md:top-14 md:w-56 dark:border-stone-600 dark:brightness-90"
					:class="paperPositions[index]"
				/>
			</div>
		</NuxtLink>
	</ServerOverviewDirectoryShell>
</template>

<script setup lang="ts">
import { newspaperPublications } from '~/data/newspapers'

interface NewspaperCover {
	id: string
	src: string
}

const { t } = useI18n()
const localePath = useLocalePath()
const issueCount = newspaperPublications.reduce(
	(total, publication) => total + publication.issues.length,
	0,
)
const publicationTitles = computed(() =>
	newspaperPublications
		.map((publication) => t(publication.titleKey))
		.join(' / '),
)
const covers: NewspaperCover[] = newspaperPublications
	.flatMap((publication) => {
		const issue = [...publication.issues].sort((a, b) =>
			b.publishedAt.localeCompare(a.publishedAt),
		)[0]
		const src = issue?.coverSrc ?? issue?.pages[0]
		return src ? [{ id: publication.id, src }] : []
	})
	.slice(0, 3)
const paperPositions = [
	'left-[8%] z-10 -rotate-12 md:left-[2%]',
	'left-[35%] z-20 rotate-12 md:left-[42%]',
	'left-[22%] z-30 -rotate-2 translate-y-9 md:left-[22%] md:translate-y-14',
]
</script>
