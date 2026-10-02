<script setup lang="ts">
import {
	createDefaultMourningSettings,
	isValidAnnualDate,
	sortMourningDates,
	type MourningDate,
	type MourningSettings,
} from '~/utils/site/mourning'

definePageMeta({ middleware: 'admin-auth' })
const { t } = useI18n()
const { notifySuccess, notifyError } = useAdminToast()
const { data, error, pending, refresh } = await useFetch<MourningSettings>(
	'/api/admin/site/mourning',
)
const defaults = createDefaultMourningSettings()
const modeForm = reactive({
	manualEnabled: defaults.manualEnabled,
	automaticEnabled: defaults.automaticEnabled,
	grayscale: defaults.grayscale,
})
const dates = ref<MourningDate[]>([])
const savingSection = ref<'mode' | 'dates' | null>(null)
const datesModalOpen = ref(false)
const draft = reactive({ name: '', month: 1, day: 1 })
const draftError = ref(false)
watch(
	data,
	(value) => {
		if (!value) return
		modeForm.manualEnabled = value.manualEnabled
		modeForm.automaticEnabled = value.automaticEnabled
		modeForm.grayscale = value.grayscale
		dates.value = structuredClone(toRaw(value.dates))
	},
	{ immediate: true },
)
const modeValid = computed(
	() =>
		Number.isInteger(modeForm.grayscale) &&
		modeForm.grayscale >= 0 &&
		modeForm.grayscale <= 100,
)
const datesValid = computed(() =>
	dates.value.every(
		(date) =>
			Boolean(date.name.trim()) &&
			date.name.trim().length <= 100 &&
			isValidAnnualDate(date.month, date.day),
	),
)
const sortedDates = computed(() => sortMourningDates(dates.value))

function openDatesModal() {
	draft.name = ''
	draft.month = 1
	draft.day = 1
	draftError.value = false
	datesModalOpen.value = true
}

function addDate() {
	draftError.value =
		!draft.name.trim() ||
		draft.name.trim().length > 100 ||
		!isValidAnnualDate(draft.month, draft.day) ||
		dates.value.length >= 100
	if (draftError.value) return
	dates.value = sortMourningDates([
		...dates.value,
		{
			id: crypto.randomUUID(),
			name: draft.name.trim(),
			month: draft.month,
			day: draft.day,
		},
	])
	datesModalOpen.value = false
}

function removeDate(id: string) {
	dates.value = dates.value.filter((date) => date.id !== id)
}

async function saveSection(section: 'mode' | 'dates') {
	if (
		savingSection.value ||
		(section === 'mode' && !modeValid.value) ||
		(section === 'dates' && !datesValid.value)
	)
		return
	savingSection.value = section
	try {
		const current = await $fetch<MourningSettings>('/api/admin/site/mourning')
		const saved = await $fetch<MourningSettings>('/api/admin/site/mourning', {
			method: 'PUT',
			body: {
				...current,
				...(section === 'mode'
					? {
							manualEnabled: modeForm.manualEnabled,
							automaticEnabled: modeForm.automaticEnabled,
							grayscale: modeForm.grayscale,
						}
					: { dates: structuredClone(toRaw(dates.value)) }),
			},
		})
		if (section === 'mode') {
			modeForm.manualEnabled = saved.manualEnabled
			modeForm.automaticEnabled = saved.automaticEnabled
			modeForm.grayscale = saved.grayscale
		} else {
			dates.value = structuredClone(saved.dates)
		}
		await refreshNuxtData('site-appearance')
		notifySuccess({ title: t('admin.site.saved') })
	} catch (cause) {
		notifyError(cause)
	} finally {
		savingSection.value = null
	}
}
</script>

<template>
	<div class="grid gap-8">
		<header>
			<h1 class="text-3xl font-semibold text-slate-950 dark:text-white">
				{{ t('admin.site.title') }}
			</h1>
		</header>
		<USkeleton v-if="pending" class="h-80 rounded-xl" />
		<div v-else-if="error" class="grid gap-3">
			<p>{{ t('admin.site.loadFailed') }}</p>
			<UButton class="w-fit" @click="refresh()">{{
				t('admin.site.retry')
			}}</UButton>
		</div>
		<div v-else class="grid gap-8 lg:grid-cols-2">
			<section class="grid min-w-0 content-start gap-3">
				<div class="mx-1 flex items-center justify-between gap-3">
					<h2 class="text-2xl text-slate-950 dark:text-white">
						{{ t('admin.site.mourning.title') }}
					</h2>
					<UButton
						type="button"
						size="sm"
						variant="link"
						icon="i-lucide-check"
						:loading="savingSection === 'mode'"
						:disabled="savingSection !== null || !modeValid"
						@click="saveSection('mode')"
					>
						{{ t('admin.actions.save') }}
					</UButton>
				</div>
				<fieldset
					:disabled="savingSection !== null"
					class="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
				>
					<AdminSiteSwitchField :label="t('admin.site.mourning.manual')">
						<USwitch v-model="modeForm.manualEnabled" />
					</AdminSiteSwitchField>
					<AdminSiteSwitchField :label="t('admin.site.mourning.automatic')">
						<USwitch v-model="modeForm.automaticEnabled" />
					</AdminSiteSwitchField>
					<AdminSiteField :label="t('admin.site.mourning.grayscale')">
						<div class="grid gap-1.5">
							<UInput
								v-model.number="modeForm.grayscale"
								type="number"
								:min="0"
								:max="100"
								:step="1"
								class="w-full text-sm"
							/>
							<div class="text-xs text-slate-500 dark:text-slate-400">
								{{ t('admin.site.mourning.grayscaleHelp') }}
							</div>
						</div>
					</AdminSiteField>
				</fieldset>
			</section>
			<section class="grid min-w-0 content-start gap-3">
				<div class="mx-1 flex items-center justify-between gap-3">
					<h2 class="text-2xl text-slate-950 dark:text-white">
						{{ t('admin.site.mourning.dates') }}
					</h2>
					<div class="flex items-center gap-1">
						<UButton
							type="button"
							size="sm"
							variant="link"
							icon="i-lucide-plus"
							:disabled="savingSection !== null || dates.length >= 100"
							@click="openDatesModal"
						>
							{{ t('admin.site.mourning.manageDates') }}
						</UButton>
						<UButton
							type="button"
							size="sm"
							variant="link"
							icon="i-lucide-check"
							:loading="savingSection === 'dates'"
							:disabled="savingSection !== null || !datesValid"
							@click="saveSection('dates')"
						>
							{{ t('admin.actions.save') }}
						</UButton>
					</div>
				</div>
				<div
					class="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
				>
					<p v-if="!sortedDates.length" class="text-sm text-slate-500">
						{{ t('admin.site.mourning.empty') }}
					</p>
					<ul v-else class="grid max-h-80 gap-2 overflow-y-auto">
						<li
							v-for="date in sortedDates"
							:key="date.id"
							class="grid grid-cols-[5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-sm"
						>
							<span class="tabular-nums text-slate-500 dark:text-slate-400">
								{{
									t('admin.site.mourning.date', {
										month: date.month,
										day: date.day,
									})
								}}
							</span>
							<UInput
								v-model="date.name"
								:aria-label="t('admin.site.mourning.name')"
								:maxlength="100"
								:disabled="savingSection !== null"
								class="w-full text-sm"
							/>
							<UButton
								type="button"
								color="neutral"
								variant="ghost"
								icon="i-lucide-trash-2"
								:aria-label="
									t('admin.site.mourning.remove', { name: date.name })
								"
								:disabled="savingSection !== null"
								@click="removeDate(date.id)"
							/>
						</li>
					</ul>
					<p v-if="!datesValid" role="alert" class="text-sm text-error">
						{{ t('errors.codes.SITE_MOURNING_SETTINGS_INVALID') }}
					</p>
				</div>
			</section>
		</div>
		<UModal
			v-model:open="datesModalOpen"
			:title="t('admin.site.mourning.dates')"
			:ui="{ content: 'max-w-2xl' }"
		>
			<template #body>
				<div class="grid gap-4">
					<form class="grid gap-4" @submit.prevent="addDate">
						<AdminSiteField :label="t('admin.site.mourning.name')">
							<UInput
								v-model="draft.name"
								:maxlength="100"
								class="w-full text-sm"
							/>
						</AdminSiteField>
						<AdminSiteField
							as="div"
							:label="t('admin.site.mourning.dateLabel')"
						>
							<div class="grid grid-cols-2 gap-3">
								<label class="grid gap-1.5">
									<span class="text-xs text-slate-500 dark:text-slate-400">
										{{ t('admin.site.mourning.month') }}
									</span>
									<UInput
										v-model.number="draft.month"
										type="number"
										:min="1"
										:max="12"
										class="w-full text-sm"
									/>
								</label>
								<label class="grid gap-1.5">
									<span class="text-xs text-slate-500 dark:text-slate-400">
										{{ t('admin.site.mourning.day') }}
									</span>
									<UInput
										v-model.number="draft.day"
										type="number"
										:min="1"
										:max="31"
										class="w-full text-sm"
									/>
								</label>
							</div>
						</AdminSiteField>
						<p v-if="draftError" role="alert" class="text-sm text-error">
							{{ t('errors.codes.SITE_MOURNING_SETTINGS_INVALID') }}
						</p>
					</form>
					<p class="text-xs leading-5 text-slate-500 dark:text-slate-400">
						{{ t('admin.site.mourning.calendarHelp') }}
					</p>
				</div>
			</template>
			<template #footer>
				<div class="flex w-full justify-end gap-2">
					<UButton
						type="button"
						color="neutral"
						variant="ghost"
						@click="datesModalOpen = false"
					>
						{{ t('admin.actions.cancel') }}
					</UButton>
					<UButton
						type="button"
						icon="i-lucide-plus"
						:disabled="dates.length >= 100"
						@click="addDate"
					>
						{{ t('admin.site.mourning.add') }}
					</UButton>
				</div>
			</template>
		</UModal>
	</div>
</template>
