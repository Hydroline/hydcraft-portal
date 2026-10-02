<template>
	<Teleport to="body" :disabled="mode === 'card'">
		<canvas
			ref="canvas"
			aria-hidden="true"
			class="pointer-events-none inset-0 h-full w-full"
			:class="[
				mode === 'card' ? 'absolute z-20' : 'fixed z-50',
				{ invisible: !active },
			]"
		/>
	</Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		enabled: boolean
		visitKey: string
		mode?: 'fullscreen' | 'card'
	}>(),
	{ mode: 'fullscreen' },
)
const canvas = ref<HTMLCanvasElement | null>(null)
const active = ref(false)
let consumed = false
let timer: ReturnType<typeof setTimeout> | undefined
let frame = 0
let motion: MediaQueryList | undefined
let observer: IntersectionObserver | undefined
let visible = props.mode !== 'card'

function stop() {
	clearTimeout(timer)
	cancelAnimationFrame(frame)
	active.value = false
}

function schedule(delay = 300) {
	if (!props.enabled || motion?.matches || document.hidden || !visible) return
	if (props.mode !== 'card' && consumed) return
	clearTimeout(timer)
	timer = setTimeout(() => {
		consumed = true
		play()
	}, delay)
}

function resume() {
	stop()
	schedule()
}

function play() {
	const element = canvas.value
	const context = element?.getContext('2d')
	if (!element || !context || motion?.matches) return
	active.value = true
	const card = props.mode === 'card'
	const width = card ? element.clientWidth : window.innerWidth
	const height = card ? element.clientHeight : window.innerHeight
	if (!width || !height) {
		stop()
		return
	}
	const ratio = Math.min(window.devicePixelRatio || 1, 2)
	element.width = width * ratio
	element.height = height * ratio
	context.setTransform(ratio, 0, 0, ratio, 0, 0)
	const styles = getComputedStyle(document.documentElement)
	const colors = [
		'--color-hydcraft-red',
		'--color-hydcraft-blue',
		'--color-amber-400',
		'--color-emerald-400',
		'--color-violet-400',
	]
		.map((token) => styles.getPropertyValue(token).trim())
		.filter(Boolean)
	if (!colors.length) {
		stop()
		return
	}
	const count = card ? 32 : width < 640 ? 80 : 150
	const particles = Array.from({ length: count }, (_, index) => {
		const left = index % 2 === 0
		return {
			x: card ? Math.random() * width : left ? width * 0.04 : width * 0.96,
			y: card ? -12 : height * 0.92,
			vx: card
				? (Math.random() - 0.5) * 24
				: (left ? 1 : -1) * width * (0.16 + Math.random() * 0.34),
			// Max rise is v² / (2g): 0.95² / (2 × 0.65) ≈ 69% of the viewport.
			vy: card
				? height * (0.15 + Math.random() * 0.12)
				: -height * (0.7 + Math.random() * 0.25),
			delay: card ? Math.random() * 1000 : index < count / 2 ? 0 : 450,
			size: card ? 7 + Math.random() * 5 : 9 + Math.random() * 6,
			rotation: Math.random() * Math.PI,
			spin: (Math.random() - 0.5) * 10,
			color: colors[index % colors.length]!,
		}
	})
	const start = performance.now()
	let previous = start
	function draw(now: number) {
		if (!context) return
		const elapsed = now - start
		if (elapsed >= 4200) {
			stop()
			if (card) schedule(5000)
			return
		}
		const dt = Math.min((now - previous) / 1000, 0.05)
		previous = now
		context.clearRect(0, 0, width, height)
		for (const particle of particles) {
			if (elapsed < particle.delay) continue
			particle.x += particle.vx * dt
			particle.y += particle.vy * dt
			particle.vx *= Math.exp(-0.5 * dt)
			particle.vy += height * (card ? 0.12 : 0.65) * dt
			particle.rotation += particle.spin * dt
			context.save()
			context.globalAlpha = Math.min(1, (4200 - elapsed) / 900)
			context.translate(particle.x, particle.y)
			context.rotate(particle.rotation)
			context.fillStyle = particle.color
			context.fillRect(
				-particle.size / 2,
				-particle.size / 4,
				particle.size,
				particle.size / 2,
			)
			context.restore()
		}
		frame = requestAnimationFrame(draw)
	}
	frame = requestAnimationFrame(draw)
}

onMounted(() => {
	motion = window.matchMedia('(prefers-reduced-motion: reduce)')
	motion.addEventListener('change', resume)
	document.addEventListener('visibilitychange', resume)
	if (props.mode === 'card' && canvas.value) {
		observer = new IntersectionObserver(
			(entries) => {
				visible = entries.some(
					(entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2,
				)
				resume()
			},
			{ threshold: 0.2 },
		)
		observer.observe(canvas.value)
	}
	watch(
		() => [props.visitKey, props.enabled] as const,
		([key, enabled], previous) => {
			if (key !== previous?.[0]) {
				stop()
				consumed = false
			}
			if (!enabled) {
				stop()
				return
			}
			schedule()
		},
		{ immediate: true, flush: 'post' },
	)
})

onBeforeUnmount(() => {
	stop()
	observer?.disconnect()
	motion?.removeEventListener('change', resume)
	document.removeEventListener('visibilitychange', resume)
})
</script>
