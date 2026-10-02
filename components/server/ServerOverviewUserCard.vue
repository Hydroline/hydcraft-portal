<template>
	<NuxtLink :to="profilePath" class="group block h-full">
		<article
			class="relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
		>
			<ProfileBirthdayCelebration
				mode="card"
				:visit-key="user.username"
				:enabled="user.isBirthdayToday === true"
			/>
			<div class="absolute inset-0 select-none">
				<SkeletonImage
					:src="coverSrc"
					:alt="user.displayName || user.username"
					class="h-full w-full"
					image-class="block h-full w-full object-cover"
					skeleton-class="rounded-none"
				/>
				<div
					class="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.28)_42%,rgba(15,23,42,0.88)_100%)]"
				/>
				<div
					class="absolute inset-0 bg-slate-950/0 transition-colors duration-150 group-hover:bg-slate-950/18 dark:bg-white/0 dark:group-hover:bg-white/6"
				/>
			</div>

			<div class="relative z-10 flex min-h-90 flex-col justify-end p-4">
				<div class="relative mb-1 w-fit">
					<UAvatar
						:src="user.avatarUrl || undefined"
						:alt="user.displayName || user.username"
						:text="avatarText"
						size="xl"
						class="border border-white/30 shadow-lg"
					/>
					<UTooltip
						v-if="user.isBirthdayToday"
						:text="t('profile.public.birthday.today')"
					>
						<span
							tabindex="0"
							:aria-label="t('profile.public.birthday.today')"
							class="absolute right-0 bottom-0 inline-flex size-4 items-center justify-center rounded-full border border-white/30 bg-rose-50 text-rose-500 dark:bg-slate-900 dark:text-rose-300"
						>
							<UIcon name="i-lucide-cake" class="size-2.5" />
						</span>
					</UTooltip>
				</div>

				<div class="min-w-0">
					<div class="truncate text-base font-medium text-white">
						{{ user.displayName || user.username }}
					</div>
					<div class="truncate text-sm text-slate-200">
						@{{ user.username }}
					</div>
					<p
						v-if="user.bio"
						class="mt-2 line-clamp-3 text-base leading-6 text-slate-100/92"
					>
						{{ user.bio }}
					</p>
				</div>
			</div>
		</article>
	</NuxtLink>
</template>

<script setup lang="ts">
import defaultCover from '~/assets/resources/pages/timeline_cover.webp'
import type { ServerOverviewRecommendedUser } from '~/utils/server/overview'

interface Props {
	user: ServerOverviewRecommendedUser
}

const props = defineProps<Props>()
const localePath = useLocalePath()
const { t } = useI18n()

const coverSrc = computed(() => props.user.coverUrl || defaultCover)
const avatarText = computed(() =>
	(props.user.displayName || props.user.username || '?')
		.slice(0, 1)
		.toUpperCase(),
)
const profilePath = computed(() => localePath(`/u/${props.user.username}`))
</script>
