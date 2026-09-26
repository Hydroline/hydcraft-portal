<template>
	<div class="pointer-events-none absolute inset-0 z-[60]" aria-hidden="true">
		<div class="immersive-site-shell relative h-full">
			<Transition
				enter-active-class="transition-opacity duration-500 ease-out motion-reduce:transition-none"
				leave-active-class="transition-opacity duration-150 ease-out motion-reduce:transition-none"
				enter-from-class="opacity-0"
				leave-to-class="opacity-0"
			>
				<div
					v-if="visible && phase && !suppressed"
					:key="phase"
					class="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] flex h-6 items-center gap-2.5 text-base font-medium tracking-wide text-white/90 [text-shadow:0_2px_12px_rgba(2,6,23,0.8)] lg:bottom-[max(3rem,env(safe-area-inset-bottom))]"
					:class="{
						'left-[max(1.5rem,env(safe-area-inset-left))] sm:left-10 lg:left-1/2 lg:-translate-x-1/2':
							phase === 'hero',
						'hidden lg:left-16 lg:flex': phase === 'players',
						'right-[max(1.5rem,env(safe-area-inset-right))] sm:right-10 lg:right-auto lg:left-1/2 lg:-translate-x-1/2':
							phase === 'community',
					}"
				>
					<span
						class="relative block h-8 w-5 shrink-0 overflow-hidden rounded-full border-2 border-current"
					>
						<span
							class="home-scroll-wheel absolute top-1.5 left-1/2 h-2.5 w-[3px] -translate-x-1/2 rounded-full bg-current"
						/>
					</span>
					<span class="whitespace-nowrap">{{
						$t('home.immersive.scrollToContinue')
					}}</span>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	phase: 'hero' | 'players' | 'community' | null
	active: boolean
	suppressed: boolean
}>()

const visible = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | null = null
let stopWatching: (() => void) | undefined

onMounted(() => {
	stopWatching = watch(
		() => [props.phase, props.active] as const,
		() => {
			if (revealTimer) clearTimeout(revealTimer)
			revealTimer = null
			visible.value = false
			if (!props.phase || !props.active) return
			revealTimer = setTimeout(() => {
				visible.value = true
				revealTimer = null
			}, 500)
		},
		{ immediate: true },
	)
})

onBeforeUnmount(() => {
	stopWatching?.()
	if (revealTimer) clearTimeout(revealTimer)
})
</script>

<style scoped>
.home-scroll-wheel {
	animation: home-scroll-wheel 2.4s ease-in-out infinite;
}

@keyframes home-scroll-wheel {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(6px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.home-scroll-wheel {
		animation: none;
	}
}
</style>
