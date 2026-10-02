<template>
	<div
		class="grid min-w-0 gap-1 text-sm md:grid-cols-[fit-content(60%)_minmax(0,1fr)] md:items-start"
	>
		<span
			class="min-w-0 max-w-full wrap-break-word hyphens-auto text-slate-500 dark:text-slate-400"
		>
			{{ label }}
		</span>
		<div
			v-if="href?.startsWith('mailto:')"
			class="flex min-w-0 items-start gap-2 md:justify-end"
		>
			<a
				:href="href"
				class="min-w-0 break-all text-slate-800 dark:text-slate-100 md:text-right"
				>{{ value }}</a
			>
			<UButton
				icon="i-lucide-copy"
				color="neutral"
				variant="link"
				class="mt-0.5 shrink-0 p-0 text-slate-400"
				:ui="{ leadingIcon: 'size-3.5' }"
				:aria-label="$t('profile.notifications.copyEmail')"
				@click="copyEmail"
			/>
		</div>
		<a
			v-else-if="href"
			:href="href"
			target="_blank"
			rel="noopener noreferrer"
			class="flex min-w-0 max-w-full items-start md:justify-end gap-2 transition-colors hover:text-slate-950 dark:hover:text-white"
		>
			<span
				class="min-w-0 max-w-full break-all md:text-right text-slate-800 dark:text-slate-100"
			>
				{{ value }}
			</span>
			<UIcon
				name="i-lucide-external-link"
				class="mt-0.5 size-3.5 shrink-0 text-slate-400"
			/>
		</a>
		<span
			v-else
			class="min-w-0 max-w-full break-all md:text-right text-slate-800 dark:text-slate-100"
		>
			{{ value }}
		</span>
	</div>
</template>

<script setup lang="ts">
interface ProfileInfoRowProps {
	label: string
	value: string
	href?: string
}

const props = defineProps<ProfileInfoRowProps>()
const { t } = useI18n()
const toast = useToast()

async function copyEmail() {
	try {
		await navigator.clipboard.writeText(props.value)
		toast.add({
			title: t('profile.notifications.copied'),
			color: 'success',
			icon: 'i-lucide-check',
		})
	} catch {
		toast.add({
			title: t('profile.notifications.copyFailed'),
			color: 'error',
			icon: 'i-lucide-circle-alert',
		})
	}
}
</script>
