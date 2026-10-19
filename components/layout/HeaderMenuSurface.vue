<script setup lang="ts">
import type { CSSProperties } from 'vue'

interface PillBounds {
	x: number
	y: number
	width: number
	height: number
}

interface PointerSample {
	x: number
	y: number
}

const surface = ref<HTMLElement | null>(null)
const selected = ref<PillBounds | null>(null)
const preview = ref<PillBounds | null>(null)
const previewVisible = ref(false)
const pressed = ref(false)
const previewPositioned = ref(false)
const ready = ref(false)
const selectionAnimated = ref(false)
let geometry = new Map<HTMLElement, PillBounds>()
let observer: ResizeObserver | null = null
let mutations: MutationObserver | null = null
let frame = 0
let revealFrame = 0
let selectionFrame = 0
let hiddenAt = -Infinity
let sample: PointerSample | null = null
let gesture: { id: number; x: number; y: number } | null = null
let focused: HTMLElement | null = null

const pillStyle = (bounds: PillBounds | null): CSSProperties => ({
	width: `${bounds?.width ?? 0}px`,
	height: `${bounds?.height ?? 0}px`,
	transform: `translate3d(${bounds?.x ?? 0}px, ${bounds?.y ?? 0}px, 0) scale(${pressed.value ? 0.985 : 1})`,
})

const selectedStyle = computed<CSSProperties>(() => ({
	...pillStyle(selected.value),
	// Press feedback belongs to the preview, not the current-page marker.
	transform: `translate3d(${selected.value?.x ?? 0}px, ${selected.value?.y ?? 0}px, 0)`,
	opacity: selected.value ? 1 : 0,
}))
const previewStyle = computed<CSSProperties>(() => ({
	...pillStyle(preview.value),
	opacity: previewVisible.value ? 1 : 0,
}))

const clearPreview = () => {
	if (frame) cancelAnimationFrame(frame)
	if (revealFrame) cancelAnimationFrame(revealFrame)
	frame = 0
	revealFrame = 0
	sample = null
	if (previewVisible.value) hiddenAt = performance.now()
	previewVisible.value = false
	pressed.value = false
}

const showPreview = (bounds: PillBounds) => {
	preview.value = bounds
	if (previewVisible.value || revealFrame) return
	// A quick re-entry reverses the unfinished fade instead of teleporting it.
	if (previewPositioned.value && performance.now() - hiddenAt < 180) {
		previewVisible.value = true
		return
	}
	// Seed the hidden pill at the entry point before fading it in. There is no
	// outer shell to conceal travel from a previous hover position.
	previewPositioned.value = false
	revealFrame = requestAnimationFrame(() => {
		revealFrame = requestAnimationFrame(() => {
			revealFrame = 0
			previewPositioned.value = true
			previewVisible.value = true
		})
	})
}

const measure = () => {
	const root = surface.value
	if (!root) return
	const previousItems = new Set(geometry.keys())
	geometry = new Map()
	for (const item of root.querySelectorAll<HTMLElement>(
		'[data-header-menu-link]',
	)) {
		const height = Math.max(
			0,
			Math.min(
				item.offsetHeight - 8,
				item.dataset.headerMenuCompact === 'true' ? 24 : Infinity,
			),
		)
		geometry.set(item, {
			x: item.offsetLeft + 1,
			y: item.offsetTop + (item.offsetHeight - height) / 2,
			width: Math.max(0, item.offsetWidth - 2),
			height,
		})
		observer?.observe(item)
		previousItems.delete(item)
	}
	for (const item of previousItems) observer?.unobserve(item)
	const active = root.querySelector<HTMLElement>(
		'[data-header-menu-selected="true"]',
	)
	selected.value = active ? (geometry.get(active) ?? null) : null
	ready.value = true
	if (focused && geometry.has(focused)) showPreview(geometry.get(focused)!)
	else clearPreview()
}

const previewAt = ({ x, y }: PointerSample) => {
	const root = surface.value
	if (!root || !root.offsetWidth) return
	const rect = root.getBoundingClientRect()
	const scale = rect.width / root.offsetWidth || 1
	const px = (x - rect.left) / scale
	const py = (y - rect.top) / scale
	// Only the item row and its small gaps activate the borderless surface.
	const row = [...geometry.values()].filter(
		(item) => py >= item.y - 4 && py <= item.y + item.height + 4,
	)
	if (!row.length) return clearPreview()
	const left = Math.min(...row.map((item) => item.x))
	const right = Math.max(...row.map((item) => item.x + item.width))
	if (px < left - 1 || px > right + 1) return clearPreview()
	let weightSum = 0
	let centerSum = 0
	let widthSum = 0
	for (const item of row) {
		const center = item.x + item.width / 2
		const weight = Math.exp(-(((px - center) / 40) ** 2) / 2)
		weightSum += weight
		centerSum += center * weight
		widthSum += item.width * weight
	}
	const nearest = row.reduce((a, b) =>
		Math.abs(px - a.x - a.width / 2) < Math.abs(px - b.x - b.width / 2) ? a : b,
	)
	const width = Math.max(
		0,
		(weightSum ? widthSum / weightSum : nearest.width) - 6,
	)
	const center = px * 0.65 + (weightSum ? centerSum / weightSum : px) * 0.35
	showPreview({
		...nearest,
		width,
		x: Math.max(left, Math.min(right - width, center - width / 2)),
	})
}

const onPointerMove = (event: PointerEvent) => {
	if (!event.isPrimary || (event.pointerType === 'touch' && !gesture)) return
	if (
		gesture &&
		Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 8
	) {
		gesture = null
		clearPreview()
		if (event.pointerType === 'touch') return
	}
	sample = { x: event.clientX, y: event.clientY }
	if (frame) return
	frame = requestAnimationFrame(() => {
		frame = 0
		if (sample) previewAt(sample)
		sample = null
	})
}

const onPointerDown = (event: PointerEvent) => {
	if (!event.isPrimary || event.button !== 0) return
	focused = null
	gesture = { id: event.pointerId, x: event.clientX, y: event.clientY }
	pressed.value = true
	previewAt({ x: event.clientX, y: event.clientY })
}
const onPointerUp = (event: PointerEvent) => {
	if (gesture?.id !== event.pointerId) return
	gesture = null
	pressed.value = false
	if (event.pointerType === 'touch') clearPreview()
}
const resetPointer = () => {
	gesture = null
	clearPreview()
}
const onFocus = (event: FocusEvent) => {
	const item =
		event.target instanceof HTMLElement
			? event.target.closest<HTMLElement>('[data-header-menu-link]')
			: null
	if (!item?.matches(':focus-visible')) return
	focused = item
	const bounds = geometry.get(item)
	if (bounds) showPreview(bounds)
}
const onBlur = () => {
	focused = null
	clearPreview()
}

onMounted(() => {
	observer = new ResizeObserver(measure)
	if (surface.value) {
		observer.observe(surface.value)
		mutations = new MutationObserver(measure)
		mutations.observe(surface.value, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: [
				'data-header-menu-selected',
				'data-header-menu-compact',
			],
		})
	}
	measure()
	selectionFrame = requestAnimationFrame(() => {
		selectionFrame = requestAnimationFrame(() => {
			selectionFrame = 0
			selectionAnimated.value = true
		})
	})
	void document.fonts.ready.then(() => {
		if (surface.value) measure()
	})
	window.addEventListener('pointerup', onPointerUp)
	window.addEventListener('blur', resetPointer)
})
onBeforeUnmount(() => {
	resetPointer()
	if (selectionFrame) cancelAnimationFrame(selectionFrame)
	observer?.disconnect()
	mutations?.disconnect()
	window.removeEventListener('pointerup', onPointerUp)
	window.removeEventListener('blur', resetPointer)
})
</script>

<template>
	<div
		ref="surface"
		class="header-menu-surface relative isolate"
		:data-highlight-ready="ready"
		@pointerenter="$event.pointerType !== 'touch' && onPointerMove($event)"
		@pointermove="onPointerMove"
		@pointerdown="onPointerDown"
		@pointerup="onPointerUp"
		@pointerleave="resetPointer"
		@pointercancel="resetPointer"
		@focusin="onFocus"
		@focusout="onBlur"
	>
		<span
			class="menu-pill pointer-events-none absolute top-0 left-0 -z-10 rounded-xl bg-sky-300/28 dark:bg-sky-300/16"
			:class="{ 'menu-pill-initial': !selectionAnimated }"
			:style="selectedStyle"
			aria-hidden="true"
		/>
		<span
			class="menu-pill pointer-events-none absolute top-0 left-0 -z-10 rounded-xl bg-sky-300/12 dark:bg-sky-300/8"
			:class="{ 'menu-pill-entry': !previewPositioned }"
			:style="previewStyle"
			aria-hidden="true"
		/>
		<slot />
	</div>
</template>

<style scoped>
.menu-pill {
	transition:
		transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
		opacity 180ms ease-out,
		width 220ms ease-out;
}
.menu-pill-entry {
	transition: opacity 180ms ease-out;
}
.menu-pill-initial {
	transition: none;
}
.header-menu-surface:not([data-highlight-ready='true'])
	:deep([data-header-menu-selected='true']::before) {
	content: '';
	position: absolute;
	inset: 4px 1px;
	z-index: -1;
	border-radius: var(--radius-xl);
	background: color-mix(in srgb, var(--color-sky-300) 28%, transparent);
}
.header-menu-surface:not([data-highlight-ready='true'])
	:deep(
		[data-header-menu-selected='true'][data-header-menu-compact='true']::before
	) {
	top: 50%;
	bottom: auto;
	height: 24px;
	transform: translateY(-50%);
}
.dark
	.header-menu-surface:not([data-highlight-ready='true'])
	:deep([data-header-menu-selected='true']::before) {
	background: color-mix(in srgb, var(--color-sky-300) 16%, transparent);
}
@media (prefers-reduced-motion: reduce) {
	.menu-pill {
		transition: none;
	}
}
</style>
