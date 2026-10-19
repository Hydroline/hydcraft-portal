<template>
	<ServerOverviewMapShell
		:title="t('content.serverOverview.cards.mtr.title')"
		:open-label="t('content.serverOverview.actions.openMap')"
		open-to="https://rail.oxygen.hydcraft.cn"
	>
		<div
			class="absolute inset-0 bg-linear-to-br from-sky-50/50 via-white to-sky-100/50 dark:from-slate-950 dark:via-slate-950 dark:to-sky-950/40"
		/>
		<!-- Decorative railway geometry; it does not represent actual routes or stations. -->
		<svg
			class="absolute inset-y-0 -right-4 h-full w-[76%] opacity-80 dark:opacity-75"
			viewBox="0 0 420 168"
			fill="none"
			preserveAspectRatio="xMaxYMid slice"
			aria-hidden="true"
		>
			<g stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5">
				<path
					d="M-20 128H112L168 72H252L300 24H440"
					class="stroke-sky-500 dark:stroke-sky-400"
				/>
				<path
					d="M-20 0L52 72H168L244 148H440"
					class="stroke-emerald-500 dark:stroke-emerald-400"
				/>
				<path
					d="M212 -20V32L264 84H336L376 124H440"
					class="stroke-rose-400 dark:stroke-rose-400"
				/>
				<path
					d="M84 188V128L140 72V-20"
					class="stroke-amber-400 dark:stroke-amber-300"
				/>
			</g>
			<g
				class="fill-white stroke-sky-500 dark:fill-slate-950 dark:stroke-sky-400"
				stroke-width="2"
			>
				<circle cx="112" cy="128" r="3.5" />
				<circle cx="300" cy="24" r="3.5" />
				<circle cx="348" cy="24" r="3.5" />
			</g>
			<g
				class="fill-white stroke-emerald-500 dark:fill-slate-950 dark:stroke-emerald-400"
				stroke-width="2"
			>
				<circle cx="244" cy="148" r="3.5" />
				<circle cx="300" cy="148" r="3.5" />
				<circle cx="354" cy="148" r="3.5" />
			</g>
			<g
				class="fill-white stroke-rose-400 dark:fill-slate-950"
				stroke-width="2"
			>
				<circle cx="212" cy="32" r="3.5" />
				<circle cx="310" cy="84" r="3.5" />
				<circle cx="376" cy="124" r="3.5" />
			</g>
			<g
				class="fill-white stroke-slate-500 dark:fill-slate-950 dark:stroke-slate-300"
				stroke-width="2"
			>
				<circle cx="168" cy="72" r="6" />
				<circle cx="252" cy="72" r="6" />
				<circle cx="140" cy="72" r="5" />
			</g>
		</svg>
		<div
			class="absolute inset-0 bg-linear-to-r from-white via-white/85 via-30% to-transparent to-75% dark:from-slate-950 dark:via-slate-950/85"
		/>
	</ServerOverviewMapShell>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
