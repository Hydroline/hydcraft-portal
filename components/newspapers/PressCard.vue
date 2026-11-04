<template>
	<section
		class="flex min-w-0 flex-col gap-5"
		:aria-labelledby="`press-${publication.id}`"
	>
		<div
			class="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-950 dark:border-slate-800"
		>
			<SkeletonImage
				v-if="publication.backgroundSrc"
				:src="publication.backgroundSrc"
				alt=""
				class="absolute inset-0 h-full w-full"
				image-class="h-full w-full object-cover"
			/>
			<div
				class="absolute inset-0 bg-linear-to-r from-slate-950/90 to-slate-950/60"
			/>
			<div class="relative flex flex-col gap-6 p-6 sm:p-8">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h2
							:id="`press-${publication.id}`"
							class="font-arkpixel text-3xl text-white"
						>
							{{ t(publication.titleKey) }}
						</h2>
						<p
							v-if="publication.descriptionKey"
							class="mt-3 max-w-3xl text-white/80"
						>
							{{ t(publication.descriptionKey) }}
						</p>
					</div>
					<div v-if="issues.length" class="flex shrink-0 gap-1">
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-chevron-left"
							class="text-white hover:bg-white/14 hover:text-white"
							:aria-label="t('newspapers.previousIssues')"
							:disabled="!canScrollBack"
							@click="scrollGallery(-1)"
						/>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-chevron-right"
							class="text-white hover:bg-white/14 hover:text-white"
							:aria-label="t('newspapers.nextIssues')"
							:disabled="!canScrollForward"
							@click="scrollGallery(1)"
						/>
					</div>
				</div>
				<div
					ref="gallery"
					class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
					@scroll.passive="updateScroll"
				>
					<button
						v-for="issue in issues"
						:key="issue.id"
						type="button"
						class="group w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-white/12 bg-white/8 text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sky-300 sm:w-64"
						:aria-label="
							t('newspapers.readIssue', {
								title: t(publication.titleKey),
								number: issue.number,
							})
						"
						@click="activeIssue = issue"
					>
						<SkeletonImage
							:src="issue.pages[0]!"
							:alt="
								t('newspapers.frontPage', {
									title: t(publication.titleKey),
									number: issue.number,
								})
							"
							class="h-72 w-full sm:h-80"
							image-class="h-full w-full object-cover object-top"
						/>
						<div class="p-3 text-white">
							<p>{{ t('newspapers.issue', { number: issue.number }) }}</p>
							<time
								:datetime="issue.publishedAt"
								class="mt-1 block text-sm text-white/70"
								>{{ formatDate(issue.publishedAt) }}</time
							>
						</div>
					</button>
				</div>
				<p v-if="!issues.length" class="text-white/70">
					{{ t('newspapers.emptyIssues') }}
				</p>
			</div>
		</div>
		<NewspapersReader
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

const props = defineProps<{ publication: NewspaperPublication }>()
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
