<template>
	<UModal
		:open="open"
		fullscreen
		:close="false"
		:title="readerTitle"
		:description="t('newspapers.reader.help')"
		:ui="{
			overlay: 'bg-white/78 backdrop-blur-md dark:bg-slate-950/86',
			content: 'bg-transparent shadow-none ring-0',
			body: 'p-0',
		}"
		@update:open="emit('update:open', $event)"
	>
		<template #content="{ close }">
			<div
				class="relative h-dvh overflow-hidden text-slate-950 dark:text-slate-50"
				@keydown="onKeydown"
			>
				<h2 class="absolute top-4 left-4 right-16 truncate text-sm sm:left-6">
					{{ readerTitle }}
				</h2>
				<UButton
					color="neutral"
					variant="ghost"
					icon="i-lucide-x"
					class="absolute top-2 right-2 z-20 min-h-11 min-w-11 justify-center"
					:aria-label="t('newspapers.reader.close')"
					@click="close"
				/>
				<div
					ref="viewport"
					class="absolute inset-x-3 top-16 bottom-28 flex touch-none select-none items-center justify-center overflow-hidden sm:inset-x-6 sm:bottom-24"
					:class="scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''"
					@pointerdown="onPointerDown"
					@pointermove="onPointerMove"
					@pointerup="onPointerEnd"
					@pointercancel="cancelPointers"
					@lostpointercapture="
						pointers.has($event.pointerId) && cancelPointers()
					"
					@wheel.prevent="onWheel"
					@dblclick="zoom(scale > 1 ? 1 : 2)"
				>
					<AnimatePresence :initial="false" mode="wait" :custom="pageDirection">
						<motion.div
							:key="src"
							class="absolute inset-0 flex items-center justify-center"
							:custom="pageDirection"
							:variants="pageVariants"
							initial="enter"
							:animate="loading || failed ? 'enter' : 'visible'"
							exit="exit"
							:transition="{
								duration: reducedMotion ? 0 : 0.22,
								ease: 'easeOut',
							}"
						>
							<motion.img
								:src="src"
								:alt="
									t('newspapers.reader.pageAlt', {
										title,
										number: issue.number,
										page: pageIndex + 1,
									})
								"
								class="max-h-full max-w-full object-contain"
								:class="loading || failed ? 'invisible' : ''"
								:initial="false"
								:animate="{ x: offset.x, y: offset.y, scale }"
								:transition="{
									duration: reducedMotion || !animateZoom ? 0 : 0.22,
									ease: 'easeOut',
								}"
								draggable="false"
								@load="onLoad"
								@error="onError"
							/>
						</motion.div>
					</AnimatePresence>
					<div
						v-if="loading"
						class="absolute inset-0 flex items-center justify-center"
						role="status"
					>
						<span>{{ t('newspapers.reader.loading') }}</span>
					</div>
					<div
						v-if="failed"
						class="absolute inset-0 flex flex-col items-center justify-center gap-4"
						role="alert"
					>
						<p>{{ t('newspapers.reader.loadFailed') }}</p>
						<UButton color="neutral" variant="soft" @click="retry">{{
							t('newspapers.reader.retry')
						}}</UButton>
					</div>
				</div>
				<div
					class="absolute inset-x-2 bottom-[max(1rem,env(safe-area-inset-bottom))] flex justify-center sm:inset-x-6"
				>
					<div
						role="toolbar"
						:aria-label="t('newspapers.reader.toolbar')"
						class="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900/95"
					>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-chevron-left"
							class="min-h-11"
							:disabled="pageIndex === 0"
							:aria-label="t('newspapers.reader.previous')"
							@click="goPage(-1)"
							><span class="hidden sm:inline">{{
								t('newspapers.reader.previous')
							}}</span></UButton
						>
						<span
							class="min-w-16 text-center text-sm tabular-nums"
							role="status"
							aria-live="polite"
							aria-atomic="true"
							>{{
								t('newspapers.reader.pageCount', {
									current: pageIndex + 1,
									total: issue.pages.length,
								})
							}}</span
						>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-chevron-right"
							class="min-h-11"
							:disabled="pageIndex >= issue.pages.length - 1"
							:aria-label="t('newspapers.reader.next')"
							@click="goPage(1)"
							><span class="hidden sm:inline">{{
								t('newspapers.reader.next')
							}}</span></UButton
						>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-zoom-in"
							class="min-h-11"
							:disabled="scale >= 5 || loading || failed"
							:aria-label="t('newspapers.reader.zoomIn')"
							@click="zoom(scale + 0.5)"
							><span class="hidden sm:inline">{{
								t('newspapers.reader.zoomIn')
							}}</span></UButton
						>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-lucide-zoom-out"
							class="min-h-11"
							:disabled="scale <= 1 || loading || failed"
							:aria-label="t('newspapers.reader.zoomOut')"
							@click="zoom(scale - 0.5)"
							><span class="hidden sm:inline">{{
								t('newspapers.reader.zoomOut')
							}}</span></UButton
						>
						<UButton
							color="neutral"
							variant="ghost"
							class="min-h-11 tabular-nums"
							:aria-label="t('newspapers.reader.reset')"
							@click="zoom(1)"
							>{{ Math.round(scale * 100) }}%</UButton
						>
					</div>
				</div>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { AnimatePresence, motion, useReducedMotion } from 'motion-v'
import type { NewspaperIssue } from '~/data/newspapers'

interface Point {
	x: number
	y: number
}
const props = defineProps<{
	open: boolean
	issue: NewspaperIssue
	title: string
}>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const { t } = useI18n()
const readerTitle = computed(
	() =>
		`${props.title} (${t('newspapers.issue', { number: props.issue.number })})`,
)
const pageIndex = ref(0)
const pageDirection = ref(1)
const reducedMotion = useReducedMotion()
const animateZoom = ref(false)
const pageVariants = {
	enter: (direction: number) => ({
		opacity: 0,
		x: reducedMotion.value ? 0 : direction * 48,
	}),
	visible: { opacity: 1, x: 0 },
	exit: (direction: number) => ({
		opacity: 0,
		x: reducedMotion.value ? 0 : -direction * 48,
	}),
}
const retryCount = ref(0)
const src = computed(() => {
	const path = props.issue.pages[pageIndex.value] ?? ''
	if (!retryCount.value) return path
	return `${path}${path.includes('?') ? '&' : '?'}retry=${retryCount.value}`
})
const viewport = ref<HTMLElement | null>(null)
const scale = ref(1)
const offset = reactive<Point>({ x: 0, y: 0 })
const natural = reactive({ width: 0, height: 0 })
const loading = ref(true)
const failed = ref(false)
const pointers = new Map<number, Point>()
let swipeStart: Point | null = null
let swipeEligible = false
let previousCenter: Point | null = null
let previousDistance = 0

const cancelPointers = () => {
	pointers.clear()
	swipeStart = null
	previousCenter = null
	previousDistance = 0
	swipeEligible = false
}
const constrain = () => {
	const element = viewport.value
	if (!element || !natural.width || !natural.height) return
	const fit = Math.min(
		element.clientWidth / natural.width,
		element.clientHeight / natural.height,
		1,
	)
	const maxX = Math.max(
		0,
		(natural.width * fit * scale.value - element.clientWidth) / 2,
	)
	const maxY = Math.max(
		0,
		(natural.height * fit * scale.value - element.clientHeight) / 2,
	)
	offset.x = Math.max(-maxX, Math.min(maxX, offset.x))
	offset.y = Math.max(-maxY, Math.min(maxY, offset.y))
}
const zoom = (value: number, anchor?: Point, smooth = true) => {
	if (loading.value || failed.value) return
	animateZoom.value = smooth
	const next = Math.max(1, Math.min(5, value))
	const ratio = next / scale.value
	const rect = viewport.value?.getBoundingClientRect()
	const x = anchor && rect ? anchor.x - rect.left - rect.width / 2 : 0
	const y = anchor && rect ? anchor.y - rect.top - rect.height / 2 : 0
	offset.x = x - (x - offset.x) * ratio
	offset.y = y - (y - offset.y) * ratio
	scale.value = next
	constrain()
}
const reset = () => {
	animateZoom.value = false
	scale.value = 1
	offset.x = 0
	offset.y = 0
	cancelPointers()
}
const goPage = (direction: number) => {
	const nextIndex = Math.max(
		0,
		Math.min(props.issue.pages.length - 1, pageIndex.value + direction),
	)
	if (nextIndex === pageIndex.value) return
	pageDirection.value = direction > 0 ? 1 : -1
	pageIndex.value = nextIndex
}
const onLoad = (event: Event) => {
	const image = event.target as HTMLImageElement
	if (image.getAttribute('src') !== src.value) return
	natural.width = image.naturalWidth
	natural.height = image.naturalHeight
	loading.value = false
	failed.value = false
	constrain()
}
const onError = (event: Event) => {
	if ((event.target as HTMLImageElement).getAttribute('src') !== src.value)
		return
	loading.value = false
	failed.value = true
}
const retry = () => {
	retryCount.value += 1
}
watch(src, () => {
	reset()
	loading.value = true
	failed.value = false
	natural.width = 0
	natural.height = 0
})
watch(
	() => [props.issue.id, props.open],
	() => {
		pageIndex.value = 0
		retryCount.value = 0
		reset()
	},
)

const pointerGeometry = () => {
	const [first, second] = [...pointers.values()]
	if (!first) return { center: null, distance: 0 }
	return {
		center: second
			? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }
			: first,
		distance: second ? Math.hypot(first.x - second.x, first.y - second.y) : 0,
	}
}
const onPointerDown = (event: PointerEvent) => {
	if (event.button !== 0 || loading.value || failed.value) return
	const element = event.currentTarget as HTMLElement
	animateZoom.value = false
	element.setPointerCapture(event.pointerId)
	pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
	swipeEligible = pointers.size === 1 && scale.value === 1
	swipeStart = swipeEligible ? { x: event.clientX, y: event.clientY } : null
	const geometry = pointerGeometry()
	previousCenter = geometry.center
	previousDistance = geometry.distance
}
const onPointerMove = (event: PointerEvent) => {
	if (!pointers.has(event.pointerId)) return
	pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
	const { center, distance } = pointerGeometry()
	if (!center || !previousCenter) return
	if (pointers.size > 1 && previousDistance > 0)
		zoom((scale.value * distance) / previousDistance, previousCenter, false)
	if (scale.value > 1) {
		offset.x += center.x - previousCenter.x
		offset.y += center.y - previousCenter.y
		constrain()
	}
	previousCenter = center
	previousDistance = distance
}
const onPointerEnd = (event: PointerEvent) => {
	if (!pointers.has(event.pointerId)) return
	const start = swipeStart
	const shouldSwipe =
		swipeEligible && pointers.size === 1 && scale.value === 1 && start
	pointers.delete(event.pointerId)
	if (shouldSwipe) {
		const dx = event.clientX - start.x
		if (
			Math.abs(dx) > 60 &&
			Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.5
		)
			goPage(dx < 0 ? 1 : -1)
	}
	swipeEligible = false
	swipeStart = null
	const geometry = pointerGeometry()
	previousCenter = geometry.center
	previousDistance = geometry.distance
}
const onWheel = (event: WheelEvent) =>
	zoom(
		scale.value * Math.exp(-event.deltaY * 0.002),
		{
			x: event.clientX,
			y: event.clientY,
		},
		false,
	)
const onKeydown = (event: KeyboardEvent) => {
	if (event.altKey || event.ctrlKey || event.metaKey) return
	switch (event.key) {
		case 'ArrowLeft':
			goPage(-1)
			break
		case 'ArrowRight':
			goPage(1)
			break
		case '+':
		case '=':
			zoom(scale.value + 0.5)
			break
		case '-':
			zoom(scale.value - 0.5)
			break
		case '0':
			zoom(1)
			break
		default:
			return
	}
	event.preventDefault()
}
let resizeObserver: ResizeObserver | undefined
watch(
	viewport,
	(element) => {
		resizeObserver?.disconnect()
		if (!element) return
		resizeObserver = new ResizeObserver(constrain)
		resizeObserver.observe(element)
	},
	{ flush: 'post' },
)
onBeforeUnmount(() => {
	resizeObserver?.disconnect()
	cancelPointers()
})
</script>
