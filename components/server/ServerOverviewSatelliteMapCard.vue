<template>
	<ServerOverviewMapShell
		:title="t('content.serverOverview.cards.satellite.title')"
		:open-label="t('content.serverOverview.actions.openMap')"
		open-to="https://map.oxygen.hydcraft.cn"
	>
		<div
			class="absolute inset-0 bg-linear-to-br from-emerald-50/60 via-white to-emerald-100/60 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/50"
		/>
		<!-- The existing season-eight terrain drawing is a static cover, not live map data. -->
		<img
			:src="terrainCoverSrc"
			alt=""
			width="1254"
			height="1254"
			decoding="async"
			class="absolute top-1/2 -right-10 size-96 -translate-y-1/2 -rotate-12 object-contain opacity-25 mix-blend-multiply dark:opacity-20 dark:mix-blend-screen dark:invert sm:-right-4"
		/>
		<svg
			class="absolute inset-y-0 right-0 h-full w-[66%] text-emerald-600/35 dark:text-emerald-300/30"
			viewBox="0 0 360 168"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M0 36H360M0 84H360M0 132H360M72 0V168M144 0V168M216 0V168M288 0V168"
				stroke="currentColor"
				stroke-width="0.5"
				opacity="0.35"
			/>
			<circle
				cx="224"
				cy="94"
				r="26"
				stroke="currentColor"
				stroke-width="0.75"
			/>
			<path
				d="M224 58V72M224 116V130M188 94H202M246 94H260"
				stroke="currentColor"
				stroke-width="0.75"
			/>
			<circle
				cx="224"
				cy="94"
				r="7"
				class="fill-emerald-500/20 stroke-emerald-600/70 dark:fill-emerald-300/20 dark:stroke-emerald-300/70"
			/>
			<circle
				cx="224"
				cy="94"
				r="2.5"
				class="fill-emerald-600 dark:fill-emerald-300"
			/>
		</svg>
		<div
			class="absolute inset-0 bg-linear-to-r from-white via-white/85 via-30% to-transparent to-75% dark:from-slate-950 dark:via-slate-950/85"
		/>
	</ServerOverviewMapShell>
</template>

<script setup lang="ts">
import terrainCover from '~/assets/resources/minecraft-gallery/season_8/terrain_map_202606.webp'
import { getStableAssetUrl } from '~/utils/assets/stable-asset-url'

const { t } = useI18n()
const terrainCoverSrc = getStableAssetUrl(terrainCover)
</script>
