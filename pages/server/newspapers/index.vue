<template>
	<div class="site-shell flex flex-col gap-10">
		<h1
			class="text-center font-arkpixel text-3xl leading-tight tracking-wider text-slate-950 dark:text-slate-50 sm:text-4xl"
		>
			{{ t('newspapers.title') }}
		</h1>
		<div v-if="newspaperPublications.length" class="flex flex-col gap-12">
			<PressCard
				v-for="publication in newspaperPublications"
				:key="publication.id"
				:publication="publication"
			/>
		</div>
		<p
			v-else
			class="rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400"
		>
			{{ t('newspapers.empty') }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { newspaperPublications } from '~/data/newspapers'
import PressCard from '~/components/newspapers/PressCard.vue'

definePageMeta({ headerVariant: 'solid' })
const { t } = useI18n()
useSeoMeta({ title: () => t('newspapers.title') })
</script>
