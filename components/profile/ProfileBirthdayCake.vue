<template>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
		:class="{ 'birthday-cake--animated': animated }"
	>
		<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
		<path
			d="M4 16s.5-1 2-1s2.5 2 4 2s2.5-2 4-2s2.5 2 4 2s2-1 2-1M2 21h20M7 8v3m5-3v3m5-3v3"
		/>
		<path class="birthday-flame" d="M7 3.5v.5" />
		<path class="birthday-flame birthday-flame--middle" d="M12 3.5v.5" />
		<path class="birthday-flame birthday-flame--last" d="M17 3.5v.5" />
	</svg>
</template>

<script setup lang="ts">
interface Props {
	animated: boolean
}
defineProps<Props>()
</script>

<style scoped>
.birthday-cake--animated .birthday-flame {
	transform-box: fill-box;
	transform-origin: center bottom;
	animation: birthday-flame 1.6s ease-in-out infinite;
}
.birthday-cake--animated .birthday-flame--middle {
	animation-delay: -0.53s;
}
.birthday-cake--animated .birthday-flame--last {
	animation-delay: -1.07s;
}
@keyframes birthday-flame {
	0%,
	100% {
		transform: translate(0, 0) scaleY(1);
		opacity: 0.85;
	}
	25% {
		transform: translate(-0.45px, -0.65px) scaleY(1.6);
		opacity: 1;
	}
	55% {
		transform: translate(0.4px, 0.15px) scaleY(0.75);
		opacity: 0.5;
	}
	78% {
		transform: translate(-0.2px, -0.35px) scaleY(1.25);
		opacity: 0.95;
	}
}
@media (prefers-reduced-motion: reduce) {
	.birthday-cake--animated .birthday-flame {
		animation: none;
	}
}
</style>
