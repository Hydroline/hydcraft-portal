<template>
	<component
		:is="as ?? 'label'"
		class="grid gap-2 md:grid-cols-[180px_1fr] md:items-start"
	>
		<span class="text-[15px] text-slate-700 md:pt-1 dark:text-slate-200">
			{{ label }}
		</span>
		<span class="min-w-0 w-full">
			<slot />
		</span>
	</component>
</template>

<script setup lang="ts">
interface AdminSiteFieldProps {
	label: string
	as?: 'label' | 'div'
}

defineProps<AdminSiteFieldProps>()
</script>
