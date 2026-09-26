<template>
	<ServerOverviewDirectoryShell
		:title="t('content.serverOverview.cards.users.title')"
		:action-label="t('content.serverOverview.cards.users.action')"
		:to="localePath('/server/users')"
		:count="totalCount ?? users.length"
	>
		<template #actions>
			<UButton
				color="neutral"
				variant="link"
				icon="i-lucide-refresh-cw"
				:loading="refreshing"
				:disabled="refreshDisabled"
				@click="emit('refresh')"
			>
				{{ t('content.serverOverview.cards.users.refresh') }}
			</UButton>
		</template>

		<div v-if="users.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			<ServerOverviewUserCard
				v-for="user in users"
				:key="user.username"
				:user="user"
			/>
		</div>

		<div
			v-else
			class="rounded-xl bg-white p-8 text-center text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400"
		>
			{{ t('content.serverOverview.states.emptyUsers') }}
		</div>
	</ServerOverviewDirectoryShell>
</template>

<script setup lang="ts">
import type { ServerOverviewRecommendedUser } from '~/utils/server/overview'

interface Props {
	users: ServerOverviewRecommendedUser[]
	totalCount?: number
	refreshing?: boolean
	refreshDisabled?: boolean
}

defineProps<Props>()
const emit = defineEmits<{ refresh: [] }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>
