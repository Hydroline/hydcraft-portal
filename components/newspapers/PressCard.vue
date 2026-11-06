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
				<UBadge color="neutral" variant="soft" size="sm">{{
					t('newspapers.issueCount', { count: issues.length })
				}}</UBadge>
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
		<div class="min-w-0">
			<div
				ref="gallery"
				class="press-gallery flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto"
				@scroll.passive="updateScroll"
			>
				<button
					v-for="issue in issues"
					:key="issue.id"
					type="button"
					class="group flex w-52 cursor-pointer shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition-colors duration-200 hover:bg-stone-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-400 sm:w-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
					:aria-label="
						t('newspapers.readIssue', {
							title: t(publication.titleKey),
							number: issue.number,
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
								number: issue.number,
							})
						"
						loading="lazy"
						decoding="async"
						image-class="absolute inset-0 h-full w-full object-cover object-top"
					/>
					<div
						class="flex w-full flex-1 flex-col gap-1.5 border-t border-slate-200 p-4 dark:border-slate-700"
					>
						<p
							class="font-serif text-lg font-bold text-slate-950 dark:text-slate-50"
						>
							{{ t('newspapers.issue', { number: issue.number }) }}
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
const canScrollBack = ref(false)
const canScrollForward = ref(false)
const formatDate = (date: string) =>
	new Intl.DateTimeFormat(locale.value, {
		dateStyle: 'long',
		timeZone: 'UTC',
	}).format(new Date(`${date}T00:00:00Z`))
const updateScroll = () => {
	const element = gallery.value
	if (!element) return
	canScrollBack.value = element.scrollLeft > 1
	canScrollForward.value =
		element.scrollLeft + element.clientWidth < element.scrollWidth - 1
}
const scrollGallery = (direction: number) => {
	const element = gallery.value
	if (!element) return
	element.scrollBy({
		left: direction * element.clientWidth * 0.85,
		behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
			? 'instant'
			: 'smooth',
	})
}
let observer: ResizeObserver | undefined
onMounted(() => {
	observer = new ResizeObserver(updateScroll)
	if (gallery.value) observer.observe(gallery.value)
	updateScroll()
})
watch(issues, () => nextTick(updateScroll))
onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.press-gallery {
	scrollbar-width: none;
}

.press-gallery::-webkit-scrollbar {
	display: none;
}
</style>
