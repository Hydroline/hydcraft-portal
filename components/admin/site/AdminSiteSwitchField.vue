<template>
	<AdminSiteField :label="label">
		<span class="inline-flex w-full pt-1">
			<slot />
		</span>
	</AdminSiteField>
</template>

<script setup lang="ts">
interface AdminSiteSwitchFieldProps {
	label: string
}

defineProps<AdminSiteSwitchFieldProps>()
</script>
