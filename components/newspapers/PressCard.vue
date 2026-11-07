<template>
	<section
		class="flex min-w-0 flex-col gap-5"
		:aria-labelledby="`press-${publication.id}`"
	>
		<div class="flex items-center justify-between gap-4">
			<div class="flex min-w-0 flex-wrap items-center gap-3">
				<img
					v-if="publication.logoSrc"
					:src="publication.logoSrc"
					:alt="t(publication.logoAltKey ?? publication.titleKey)"
					class="h-12 max-w-32 object-contain"
					loading="lazy"
				/>
				<h2
					:id="`press-${publication.id}`"
					class="font-serif text-2xl font-bold text-slate-950 sm:text-3xl dark:text-slate-50"
				>
					{{ t(publication.titleKey) }}
				</h2>
				<div class="flex items-center gap-1">
					<UBadge
						v-if="publication.internal"
						color="primary"
						variant="soft"
						size="sm"
						>{{ t('newspapers.internalPublication') }}</UBadge
					>
					<UBadge color="neutral" variant="soft" size="sm">{{
						t('newspapers.issueCount', { count: issues.length })
					}}</UBadge>
					<UBadge color="neutral" variant="soft" size="sm">{{
						publicationLanguages
					}}</UBadge>
				</div>
			</div>
			<div v-if="issues.length" class="flex shrink-0 gap-1">
				<UButton
					color="neutral"
					variant="ghost"
					class="cursor-pointer disabled:cursor-default"
					icon="i-lucide-chevron-left"
					:aria-label="t('newspapers.previousIssues')"
					:disabled="!canScrollBack"
					@click="scrollGallery(-1)"
				/>
				<UButton
					color="neutral"
					variant="ghost"
					class="cursor-pointer disabled:cursor-default"
					icon="i-lucide-chevron-right"
					:aria-label="t('newspapers.nextIssues')"
					:disabled="!canScrollForward"
					@click="scrollGallery(1)"
				/>
			</div>
		</div>
		<p
			v-if="publication.descriptionKey"
			class="font-serif leading-7 text-slate-600 dark:text-slate-400"
		>
			{{ t(publication.descriptionKey) }}
		</p>
		<div class="relative isolate min-w-0">
			<div
				ref="gallery"
				class="press-gallery flex snap-x snap-mandatory items-start gap-5 overflow-x-auto [--press-card-min-width:13rem] sm:[--press-card-min-width:15rem]"
				@scroll.passive="updateScroll"
			>
				<div
					v-for="(page, pageIndex) in issuePages"
					:key="pageIndex"
					class="press-gallery-page grid w-full shrink-0 snap-start items-start gap-5"
					:style="{
						gridTemplateColumns: `repeat(${pageSize}, minmax(0, 1fr))`,
					}"
				>
					<button
						v-for="issue in page"
						:key="issue.id"
						type="button"
						class="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition-colors duration-200 hover:bg-stone-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
						:aria-label="
							t('newspapers.readIssue', {
								title: t(publication.titleKey),
								issue: getIssueLabel(issue),
							})
						"
						@click="activeIssue = issue"
					>
						<SkeletonImage
							class="aspect-[3/4] w-full overflow-hidden bg-stone-100"
							:src="issue.coverSrc ?? issue.pages[0]!"
							:alt="
								t('newspapers.frontPage', {
									title: t(publication.titleKey),
									issue: getIssueLabel(issue),
								})
							"
							loading="lazy"
							decoding="async"
							image-class="absolute inset-0 h-full w-full object-cover object-top"
						/>
						<div
							class="flex w-full flex-col gap-1.5 border-t border-slate-200 p-4 dark:border-slate-700"
						>
							<p
								class="text-lg font-semibold text-slate-950 dark:text-slate-50"
							>
								{{ getIssueLabel(issue) }}
							</p>
							<time
								:datetime="issue.publishedAt"
								class="text-xs text-slate-500 dark:text-slate-400"
								>{{ formatDate(issue.publishedAt) }}</time
							>
							<p
								v-if="issue.noteKey"
								class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400"
							>
								{{ t(issue.noteKey) }}
							</p>
						</div>
					</button>
				</div>
			</div>

			<p
				v-if="!issues.length"
				class="py-8 text-center text-slate-500 dark:text-slate-400"
			>
				{{ t('newspapers.emptyIssues') }}
			</p>
		</div>
		<NewspaperReader
			v-if="activeIssue"
			:open="true"
			:issue="activeIssue"
			:title="t(publication.titleKey)"
			@update:open="activeIssue = null"
		/>
	</section>
</template>

<script setup lang="ts">
import type { NewspaperIssue, NewspaperPublication } from '~/data/newspapers'
import NewspaperReader from './NewspaperReader.vue'

interface PressCardProps {
	publication: NewspaperPublication
}

const props = defineProps<PressCardProps>()
const { t, locale } = useI18n()
const activeIssue = ref<NewspaperIssue | null>(null)
const gallery = ref<HTMLElement | null>(null)
const issues = computed(() =>
	props.publication.issues
		.filter((issue) => issue.pages.length)
		.toSorted(
			(a, b) =>
				b.publishedAt.localeCompare(a.publishedAt) || b.number - a.number,
		),
)
const pageSize = ref(1)
const currentPage = ref(0)
const issuePages = computed(() => {
	const pages: NewspaperIssue[][] = []
	for (let index = 0; index < issues.value.length; index += pageSize.value) {
		pages.push(issues.value.slice(index, index + pageSize.value))
	}
	return pages
})
const canScrollBack = computed(() => currentPage.value > 0)
const canScrollForward = computed(
	() => currentPage.value < issuePages.value.length - 1,
)
const publicationLanguages = computed(() =>
	props.publication.languages
		.map((language) => t(`newspapers.languages.${language}`))
		.join(' / '),
)
const getIssueLabel = (issue: NewspaperIssue): string =>
	issue.labelKey
		? t(issue.labelKey)
		: t('newspapers.issue', { number: issue.number })
const formatDate = (date: string) =>
	new Intl.DateTimeFormat(locale.value, {
		dateStyle: 'long',
		timeZone: 'UTC',
	}).format(new Date(`${date}T00:00:00Z`))
const getPageStep = (element: HTMLElement): number =>
	element.clientWidth + (parseFloat(getComputedStyle(element).columnGap) || 0)
const updateScroll = () => {
	const element = gallery.value
	if (!element) return
	currentPage.value = Math.max(
		0,
		Math.min(
			issuePages.value.length - 1,
			Math.round(element.scrollLeft / getPageStep(element)),
		),
	)
}
const scrollGallery = (direction: -1 | 1) => {
	const element = gallery.value
	if (!element) return
	const targetPage = Math.max(
		0,
		Math.min(issuePages.value.length - 1, currentPage.value + direction),
	)
	element.scrollTo({
		left: targetPage * getPageStep(element),
		behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 'instant'
			: 'smooth',
	})
}
const syncLayout = async () => {
	const element = gallery.value
	if (!element) return
	const firstIssueIndex = currentPage.value * pageSize.value
	const style = getComputedStyle(element)
	const minimumWidth =
		parseFloat(style.getPropertyValue('--press-card-min-width')) *
		parseFloat(getComputedStyle(document.documentElement).fontSize)
	const gap = parseFloat(style.columnGap) || 0
	pageSize.value = Math.max(
		1,
		Math.floor((element.clientWidth + gap) / (minimumWidth + gap)),
	)
	currentPage.value = Math.min(
		Math.floor(firstIssueIndex / pageSize.value),
		Math.max(0, issuePages.value.length - 1),
	)
	await nextTick()
	element.scrollTo({
		left: currentPage.value * getPageStep(element),
		behavior: 'instant',
	})
	updateScroll()
}
let observer: ResizeObserver | undefined
onMounted(() => {
	observer = new ResizeObserver(() => {
		void syncLayout()
	})
	if (gallery.value) observer.observe(gallery.value)
	void syncLayout()
})
watch(issues, () => {
	void syncLayout()
})
onBeforeUnmount(() => {
	observer?.disconnect()
})
</script>

<style scoped>
.press-gallery {
	scrollbar-width: none;
}

.press-gallery::-webkit-scrollbar {
	display: none;
}
</style>
