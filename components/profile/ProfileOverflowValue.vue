<template>
	<div
		ref="viewport"
		class="profile-value min-w-0 overflow-x-auto whitespace-nowrap"
		:class="{ 'profile-value-mask': overflowing && !reducedMotion }"
		:title="text"
		:tabindex="overflowing && reducedMotion ? 0 : undefined"
	>
		<span
			ref="track"
			class="block w-max min-w-full text-right"
			:class="{ 'px-3': overflowing && !reducedMotion }"
		>
			<span ref="measure" class="inline-block whitespace-pre">{{
				singleLineText
			}}</span>
		</span>
	</div>
</template>

<script setup lang="ts">
interface ProfileOverflowValueProps {
	text: string
}

const props = defineProps<ProfileOverflowValueProps>()
const singleLineText = computed(() => props.text.replace(/[\r\n\t]+/g, ' '))
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const measure = ref<HTMLElement | null>(null)
const overflowing = ref(false)
const reducedMotion = ref(false)
let animation: Animation | undefined
let observer: ResizeObserver | undefined
let motionPreference: MediaQueryList | undefined
let mounted = false
let revision = 0
let previousLayout = ''

const syncPlayback = () => {
	if (document.hidden) animation?.pause()
	else if (animation?.playState === 'paused') animation.play()
}

const update = async () => {
	if (!mounted || !viewport.value || !measure.value) return
	const width = viewport.value.clientWidth
	const textWidth = measure.value.getBoundingClientRect().width
	const layout = `${props.text}:${width}:${textWidth}:${reducedMotion.value}`
	if (layout === previousLayout) return
	previousLayout = layout
	const currentRevision = ++revision
	animation?.cancel()
	animation = undefined
	overflowing.value = textWidth > width + 1
	viewport.value.scrollLeft = 0
	await nextTick()
	if (
		!mounted ||
		currentRevision !== revision ||
		!track.value ||
		!overflowing.value ||
		reducedMotion.value ||
		width <= 0
	)
		return
	const distance = textWidth + 24 - width
	const hold = 1500
	const travel = (distance / 40) * 1000
	const duration = (hold + travel) * 2
	const end = `translateX(-${distance}px)`
	animation = track.value.animate(
		[
			{ offset: 0, transform: 'translateX(0)' },
			{ offset: hold / duration, transform: 'translateX(0)' },
			{ offset: (hold + travel) / duration, transform: end },
			{ offset: (hold * 2 + travel) / duration, transform: end },
			{ offset: 1, transform: 'translateX(0)' },
		],
		{ duration, iterations: Infinity, easing: 'linear' },
	)
	syncPlayback()
}

const onMotionChange = () => {
	reducedMotion.value = motionPreference?.matches ?? false
	void update()
}

watch(() => props.text, update, { flush: 'post' })
onMounted(() => {
	mounted = true
	motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
	motionPreference.addEventListener('change', onMotionChange)
	onMotionChange()
	observer = new ResizeObserver(() => void update())
	if (viewport.value) observer.observe(viewport.value)
	if (measure.value) observer.observe(measure.value)
	document.fonts.addEventListener('loadingdone', update)
	document.addEventListener('visibilitychange', syncPlayback)
})
onBeforeUnmount(() => {
	mounted = false
	revision++
	animation?.cancel()
	observer?.disconnect()
	motionPreference?.removeEventListener('change', onMotionChange)
	document.fonts.removeEventListener('loadingdone', update)
	document.removeEventListener('visibilitychange', syncPlayback)
})
</script>

<style scoped>
.profile-value {
	scrollbar-width: none;
}
.profile-value::-webkit-scrollbar {
	display: none;
}
.profile-value-mask {
	overflow-x: hidden;
	mask-image: linear-gradient(
		to right,
		transparent,
		black 12px,
		black calc(100% - 12px),
		transparent
	);
}
</style>
