<template>
	<div
		class="group/info grid min-w-0 gap-1 text-sm"
		:class="
			marquee
				? 'grid-cols-[fit-content(60%)_minmax(0,1fr)] items-center gap-x-3'
				: 'md:grid-cols-[fit-content(60%)_minmax(0,1fr)] md:items-start'
		"
	>
		<span
			class="min-w-0 max-w-full wrap-break-word hyphens-auto text-slate-500 dark:text-slate-400"
			>{{ label }}</span
		>
		<div
			v-if="marquee"
			class="relative min-w-0 text-slate-800 dark:text-slate-100"
		>
			<a
				v-if="href"
				:href="href"
				:target="href.startsWith('mailto:') ? undefined : '_blank'"
				rel="noopener noreferrer"
				class="block min-w-0 transition-colors hover:text-slate-950 dark:hover:text-white"
			>
				<ProfileOverflowValue :text="value" />
			</a>
			<ProfileOverflowValue v-else :text="value" />
			<UButton
				v-if="copyable"
				icon="i-lucide-copy"
				color="neutral"
				variant="link"
				class="profile-copy pointer-events-none absolute left-full top-1/2 -translate-y-1/2 p-1 text-slate-400 opacity-0 transition-opacity group-hover/info:pointer-events-auto group-hover/info:opacity-100 group-focus-within/info:pointer-events-auto group-focus-within/info:opacity-100 motion-reduce:transition-none"
				:ui="{ leadingIcon: 'size-3' }"
				:aria-label="t('profile.notifications.copyField', { label })"
				@click="copyValue"
			/>
		</div>
		<div
			v-else-if="href?.startsWith('mailto:')"
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
				:aria-label="t('profile.notifications.copyEmail')"
				@click="copyValue"
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
				>{{ value }}</span
			>
			<UIcon
				name="i-lucide-external-link"
				class="mt-0.5 size-3.5 shrink-0 text-slate-400"
			/>
		</a>
		<span
			v-else
			class="min-w-0 max-w-full break-all md:text-right text-slate-800 dark:text-slate-100"
			>{{ value }}</span
		>
	</div>
</template>

<script setup lang="ts">
interface ProfileInfoRowProps {
	label: string
	value: string
	href?: string
	marquee?: boolean
	copyable?: boolean
}

const props = defineProps<ProfileInfoRowProps>()
const { t } = useI18n()
const toast = useToast()

async function copyValue() {
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

<style scoped>
@media (hover: none) {
	.profile-copy {
		pointer-events: auto;
		opacity: 1;
	}
}
</style>
