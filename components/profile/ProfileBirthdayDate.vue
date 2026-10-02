<template>
	<span class="relative inline-block whitespace-nowrap">
		{{ text }}
		<span
			v-if="animated"
			aria-hidden="true"
			class="birthday-date-sheen pointer-events-none absolute inset-0 select-none"
			>{{ text }}</span
		>
	</span>
</template>

<script setup lang="ts">
interface Props {
	text: string
	animated: boolean
}
defineProps<Props>()
</script>

<style scoped>
.birthday-date-sheen {
	color: transparent;
	background-image: linear-gradient(
		110deg,
		transparent 40%,
		rgb(255 255 255 / 80%) 48%,
		rgb(255 255 255 / 80%) 52%,
		transparent 60%
	);
	background-size: 250% 100%;
	background-clip: text;
	-webkit-background-clip: text;
	animation: birthday-date-sheen 2.8s linear infinite;
}
@keyframes birthday-date-sheen {
	0% {
		background-position: 100% 0;
		opacity: 0;
	}
	4%,
	42% {
		opacity: 1;
	}
	48%,
	100% {
		background-position: 0% 0;
		opacity: 0;
	}
}
@media (prefers-reduced-motion: reduce) {
	.birthday-date-sheen {
		display: none;
		animation: none;
	}
}
</style>
