<template>
	<UButton
		color="neutral"
		variant="link"
		:label="label"
		:disabled="disabled || spinning"
		:aria-busy="refreshing"
		@click="handleClick"
	>
		<template #leading>
			<UIcon
				name="i-lucide-refresh-cw"
				class="size-4 shrink-0"
				:class="{ 'refresh-icon-spinning': spinning }"
				@animationiteration="finishCurrentTurn"
			/>
		</template>
	</UButton>
</template>

<script setup lang="ts">
interface Props {
	label: string
	refreshing?: boolean
	disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ refresh: [] }>()

const spinning = ref(false)
const reducedMotion = ref(false)
let motionPreference: MediaQueryList | null = null

function finishCurrentTurn() {
	if (!props.refreshing) spinning.value = false
}

function handleClick() {
	if (props.disabled || spinning.value) return
	spinning.value = !reducedMotion.value
	emit('refresh')
}

function handleMotionPreferenceChange(event: MediaQueryListEvent) {
	reducedMotion.value = event.matches
	if (event.matches) spinning.value = false
}

onMounted(() => {
	motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
	reducedMotion.value = motionPreference.matches
	motionPreference.addEventListener('change', handleMotionPreferenceChange)
})

onBeforeUnmount(() => {
	motionPreference?.removeEventListener('change', handleMotionPreferenceChange)
})
</script>

<style scoped>
.refresh-icon-spinning {
	animation: refresh-icon-spin 700ms linear infinite;
}

@keyframes refresh-icon-spin {
	to {
		transform: rotate(360deg);
	}
}

@media (prefers-reduced-motion: reduce) {
	.refresh-icon-spinning {
		animation: none;
	}
}
</style>
