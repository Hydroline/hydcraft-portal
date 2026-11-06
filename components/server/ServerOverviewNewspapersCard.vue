<template>
	<ServerOverviewDirectoryShell :title="t('newspapers.title')">
		<template #titleSuffix>
			<UBadge color="neutral" variant="soft" size="sm">{{
				t('newspapers.publicationCount', {
					count: newspaperPublications.length,
				})
			}}</UBadge>
			<UBadge color="neutral" variant="soft" size="sm">{{
				t('newspapers.archiveCount', { count: issueCount })
			}}</UBadge>
		</template>
		<NuxtLink
			:to="localePath('/server/newspapers')"
			class="group relative isolate grid cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-stone-50 text-slate-950 transition-colors duration-200 hover:bg-stone-100 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:grid-cols-[1fr_1.1fr] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900"
		>
			<div
				class="relative z-10 flex flex-col items-start justify-center px-7 py-10 sm:px-10 md:py-12"
			>
				<h3
					class="max-w-md whitespace-pre-line font-serif text-3xl font-bold leading-snug tracking-wide sm:text-4xl lg:text-5xl"
				>
					{{ t('newspapers.archiveHeadline') }}
				</h3>
				<span
					class="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition-colors duration-200 group-hover:bg-white group-hover:text-slate-950 motion-reduce:transition-none dark:border-slate-700 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:group-hover:text-white"
				>
					{{ t('newspapers.view') }}
					<UIcon
						name="i-lucide-arrow-right"
						class="size-4"
						aria-hidden="true"
					/>
				</span>
			</div>
			<div class="relative min-h-64 sm:min-h-80 md:min-h-96" aria-hidden="true">
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
const covers: NewspaperCover[] = newspaperPublications
	.flatMap((publication) =>
		[...publication.issues]
			.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
			.slice(0, 2)
			.flatMap((issue) => {
				const src = issue.coverSrc ?? issue.pages[0]
				return src ? [{ id: `${publication.id}/${issue.id}`, src }] : []
			}),
	)
	.slice(0, 5)
const paperPositions = [
	'left-[4%] z-10 -rotate-15 translate-y-3',
	'left-[24%] z-20 -rotate-6',
	'left-[48%] z-10 rotate-12 translate-y-6',
	'left-[12%] z-20 -rotate-3 translate-y-20',
	'left-[36%] z-30 rotate-4 translate-y-28',
]
</script>
