<script setup lang="ts">
import {
	createDefaultMourningSettings,
	isValidAnnualDate,
	sortMourningDates,
	type MourningSettings,
} from '~/utils/site/mourning'

definePageMeta({ middleware: 'admin-auth' })
const { t } = useI18n()
const { notifySuccess, notifyError } = useAdminToast()
const { data, error, pending, refresh } = await useFetch<MourningSettings>(
	'/api/admin/site/mourning',
)
const form = ref(createDefaultMourningSettings())
const saving = ref(false)
const draft = reactive({ name: '', month: 1, day: 1 })
const draftError = ref(false)
watch(
	data,
	(value) => {
		if (value) form.value = structuredClone(toRaw(value))
	},
	{ immediate: true },
)
const dates = computed(() => sortMourningDates(form.value.dates))

function addDate() {
	draftError.value =
		!draft.name.trim() ||
		draft.name.trim().length > 100 ||
		!isValidAnnualDate(draft.month, draft.day) ||
		form.value.dates.length >= 100
	if (draftError.value) return
	form.value.dates.push({
		id: crypto.randomUUID(),
		name: draft.name.trim(),
		month: draft.month,
		day: draft.day,
	})
	draft.name = ''
}

async function save() {
	saving.value = true
	try {
		const saved = await $fetch<MourningSettings>('/api/admin/site/mourning', {
			method: 'PUT',
			body: form.value,
		})
		form.value = saved
		await refreshNuxtData('site-appearance')
		notifySuccess({ title: t('admin.site.saved') })
	} catch (cause) {
		notifyError(cause)
	} finally {
		saving.value = false
	}
}
</script>

<template>
	<div class="grid gap-8">
		<header class="grid gap-2">
			<h1 class="text-3xl font-semibold text-slate-950 dark:text-white">
				{{ t('admin.site.title') }}
			</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400">
				{{ t('admin.site.description') }}
			</p>
		</header>
		<USkeleton v-if="pending" class="h-80 rounded-xl" />
		<div v-else-if="error" class="grid gap-3">
			<p>{{ t('admin.site.loadFailed') }}</p>
			<UButton class="w-fit" @click="refresh()">{{
				t('admin.site.retry')
			}}</UButton>
		</div>
		<form v-else @submit.prevent="save">
			<fieldset
				:disabled="saving"
				class="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
			>
				<div class="grid gap-2">
					<h2 class="text-xl font-semibold">
						{{ t('admin.site.mourning.title') }}
					</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						{{ t('admin.site.mourning.description') }}
					</p>
				</div>
				<USwitch
					v-model="form.manualEnabled"
					:label="t('admin.site.mourning.manual')"
				/>
				<UFormField
					:label="t('admin.site.mourning.grayscale')"
					:help="t('admin.site.mourning.grayscaleHelp')"
				>
					<UInput
						v-model.number="form.grayscale"
						type="number"
						:min="0"
						:max="100"
						:step="1"
						required
					/>
				</UFormField>
				<USwitch
					v-model="form.automaticEnabled"
					:label="t('admin.site.mourning.automatic')"
				/>
				<div
					class="grid gap-4 border-t border-slate-200 pt-5 dark:border-slate-800"
				>
					<h3 class="font-medium">{{ t('admin.site.mourning.dates') }}</h3>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						{{ t('admin.site.mourning.calendarHelp') }}
					</p>
					<div class="grid items-end gap-3 sm:grid-cols-[1fr_6rem_6rem_auto]">
						<UFormField :label="t('admin.site.mourning.name')"
							><UInput v-model="draft.name" :maxlength="100" class="w-full"
						/></UFormField>
						<UFormField :label="t('admin.site.mourning.month')"
							><UInput
								v-model.number="draft.month"
								type="number"
								:min="1"
								:max="12"
						/></UFormField>
						<UFormField :label="t('admin.site.mourning.day')"
							><UInput
								v-model.number="draft.day"
								type="number"
								:min="1"
								:max="31"
						/></UFormField>
						<UButton
							type="button"
							icon="i-lucide-plus"
							:disabled="form.dates.length >= 100"
							@click="addDate"
							>{{ t('admin.site.mourning.add') }}</UButton
						>
					</div>
					<p v-if="draftError" role="alert" class="text-sm text-error">
						{{ t('errors.codes.SITE_MOURNING_SETTINGS_INVALID') }}
					</p>
					<p v-if="!dates.length" class="text-sm text-slate-500">
						{{ t('admin.site.mourning.empty') }}
					</p>
					<ul v-else class="grid gap-3">
						<li
							v-for="date in dates"
							:key="date.id"
							class="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900"
						>
							<span class="w-24 shrink-0 text-sm tabular-nums">{{
								t('admin.site.mourning.date', {
									month: date.month,
									day: date.day,
								})
							}}</span>
							<UInput
								v-model="date.name"
								:aria-label="t('admin.site.mourning.name')"
								:maxlength="100"
								required
								class="min-w-40 flex-1"
							/>
							<UButton
								type="button"
								color="neutral"
								variant="ghost"
								icon="i-lucide-trash-2"
								:aria-label="
									t('admin.site.mourning.remove', { name: date.name })
								"
								@click="
									form.dates = form.dates.filter((item) => item.id !== date.id)
								"
							/>
						</li>
					</ul>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<UButton type="submit" :loading="saving">{{
						t('admin.actions.save')
					}}</UButton>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						{{ t('admin.site.saveHelp') }}
					</p>
				</div>
			</fieldset>
		</form>
	</div>
</template>
