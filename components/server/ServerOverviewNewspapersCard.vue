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
			class="group relative isolate grid cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-slate-950 transition-colors duration-200 hover:bg-slate-100 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:grid-cols-[1fr_1.1fr] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900"
		>
			<div
				class="relative z-10 flex flex-col px-7 pt-10 pb-5 sm:px-10 md:pt-12"
			>
				<div class="flex flex-1 flex-col items-start justify-center">
					<h3
						class="max-w-md whitespace-pre-line font-serif text-3xl font-bold leading-snug tracking-wide sm:text-4xl lg:text-5xl"
					>
						{{ t('newspapers.archiveHeadline') }}
					</h3>
					<span
						class="mt-8 inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm text-slate-700 transition-colors duration-200 group-hover:text-slate-950 motion-reduce:transition-none dark:text-slate-300 dark:group-hover:text-white"
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
					class="mt-6 flex max-w-md items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400"
				>
					<span aria-hidden="true">*</span>
					<p>{{ t('newspapers.archiveDisclaimer') }}</p>
				</div>
			</div>
			<div
				ref="paperStack"
				class="newspaper-stack relative min-h-64 sm:min-h-80 md:min-h-96"
				aria-hidden="true"
				@pointermove="followPaperPointer"
				@pointerleave="resetPaperBreeze"
				@pointercancel="resetPaperBreeze"
			>
				<div
					class="newspaper-backdrop pointer-events-none absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200 sm:size-[30rem] md:left-[43%] md:size-[42rem] dark:bg-slate-800/70"
				/>
				<div
					v-for="(cover, index) in covers"
					:key="cover.id"
					class="newspaper-cover absolute top-4 w-40 overflow-hidden border border-stone-300 bg-white shadow-xl sm:w-52 md:top-6 md:w-56 dark:border-stone-600 dark:brightness-90"
					:class="paperPositions[index]"
					:style="{ aspectRatio: coverAspectRatios[cover.id] ?? 3 / 4 }"
				>
					<SkeletonImage
						:src="cover.src"
						alt=""
						class="h-full w-full"
						image-class="block h-full w-full object-cover"
						loading="lazy"
						decoding="async"
						@ready="updateCoverAspectRatio(cover.id, index)"
					/>
				</div>
			</div>
		</NuxtLink>
	</ServerOverviewDirectoryShell>
</template>

<script setup lang="ts">
import { newspaperPublications } from '~/data/newspapers'

interface NewspaperCoverSelection {
	publicationId: string
	issueIndex: number
}

interface NewspaperCover {
	id: string
	src: string
}

const { t } = useI18n()
const localePath = useLocalePath()
interface PaperPointerPosition {
	x: number
	y: number
}
const paperStack = ref<HTMLElement | null>(null)
const coverAspectRatios = ref<Record<string, number>>({})
const updateCoverAspectRatio = (id: string, index: number): void => {
	const image = paperStack.value?.querySelectorAll<HTMLImageElement>(
		'.newspaper-cover img',
	)[index]
	if (image?.naturalWidth && image.naturalHeight) {
		coverAspectRatios.value[id] = image.naturalWidth / image.naturalHeight
	}
}
let pointerFrame: number | undefined
let pointerPosition: PaperPointerPosition | null = null
const resetPaperBreeze = (): void => {
	if (pointerFrame !== undefined) cancelAnimationFrame(pointerFrame)
	pointerFrame = undefined
	pointerPosition = null
	for (const paper of paperStack.value?.querySelectorAll<HTMLElement>(
		'.newspaper-cover',
	) ?? []) {
		paper.style.removeProperty('--paper-tilt-x')
		paper.style.removeProperty('--paper-tilt-y')
		paper.style.removeProperty('--paper-lift')
	}
}
const followPaperPointer = (event: PointerEvent): void => {
	if (
		event.pointerType !== 'mouse' ||
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)
		return
	pointerPosition = { x: event.clientX, y: event.clientY }
	if (pointerFrame !== undefined) return
	pointerFrame = requestAnimationFrame(() => {
		pointerFrame = undefined
		const stack = paperStack.value
		const position = pointerPosition
		if (!stack || !position) return
		const bounds = stack.getBoundingClientRect()
		const papers = [...stack.querySelectorAll<HTMLElement>('.newspaper-cover')]
		const offsets = papers.map((paper) => ({
			x:
				(position.x - bounds.left - paper.offsetLeft - paper.offsetWidth / 2) /
				(paper.offsetWidth / 2),
			y:
				(position.y - bounds.top - paper.offsetTop - paper.offsetHeight / 2) /
				(paper.offsetHeight / 2),
		}))
		papers.forEach((paper, index) => {
			const offset = offsets[index]!
			const influence = Math.max(0, 1 - Math.hypot(offset.x, offset.y) / 2)
			paper.style.setProperty(
				'--paper-tilt-x',
				`${-Math.max(-1, Math.min(1, offset.y)) * 7 * influence}deg`,
			)
			paper.style.setProperty(
				'--paper-tilt-y',
				`${Math.max(-1, Math.min(1, offset.x)) * 9 * influence}deg`,
			)
			paper.style.setProperty('--paper-lift', `${14 * influence}px`)
		})
	})
}
onBeforeUnmount(resetPaperBreeze)
const issueCount = newspaperPublications.reduce(
	(total, publication) => total + publication.issues.length,
	0,
)
const coverSelections: NewspaperCoverSelection[] = [
	{ publicationId: 'central-daily', issueIndex: 0 },
	{ publicationId: 'langchao-daily', issueIndex: 0 },
	{ publicationId: 'nanbu-gulf-daily', issueIndex: 0 },
	{ publicationId: 'wenyan', issueIndex: 0 },
	{ publicationId: 'central-daily', issueIndex: 1 },
	{ publicationId: 'central-daily', issueIndex: 2 },
	{ publicationId: 'nanbu-gulf-daily', issueIndex: 1 },
	{ publicationId: 'central-daily', issueIndex: 3 },
]
const covers: NewspaperCover[] = coverSelections.flatMap((selection) => {
	const publication = newspaperPublications.find(
		(publication) =>
			publication.id === selection.publicationId && publication.internal,
	)
	const issue = publication?.issues.toSorted((a, b) =>
		b.publishedAt.localeCompare(a.publishedAt),
	)[selection.issueIndex]
	const src = issue?.coverSrc ?? issue?.pages[0]
	return publication && issue && src
		? [{ id: `${publication.id}/${issue.id}`, src }]
		: []
})
const paperPositions = [
	'left-[32%] z-50 rotate-3 translate-y-10',
	'left-[24%] z-10 -rotate-6',
	'left-[48%] z-10 rotate-12 translate-y-4',
	'left-[2%] z-40 -rotate-5 translate-y-16',
	'left-[52%] z-30 rotate-6 translate-y-8',
	'left-[16%] z-20 rotate-2 translate-y-2',
	'left-[2%] z-30 -rotate-8 translate-y-20',
	'left-[28%] z-20 rotate-8 translate-y-24',
]
</script>

<style scoped>
.newspaper-stack {
	perspective: 1000px;
}

.newspaper-cover {
	transform-origin: 50% 92%;
	transform: rotateX(var(--paper-tilt-x, 0deg))
		rotateY(var(--paper-tilt-y, 0deg)) translateZ(var(--paper-lift, 0px));
	transition: transform 180ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
	.newspaper-cover {
		transform: none;
		transition: none;
	}
}
</style>
