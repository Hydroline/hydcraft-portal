import { computed } from 'vue'
import { hasHeroVideoBackground } from '~/utils/layout/hero-video'
import {
	resolveHeaderVariant,
	resolvePageBackground,
} from '~/utils/layout/page-presentation'

type ThemeMode = 'light' | 'dark' | 'system'

interface HeaderAppearanceState {
	usesHeroVideoHeaderChrome: ComputedRef<boolean>
	selectedThemeMode: ComputedRef<ThemeMode>
	themeButtonIcon: ComputedRef<string>
	headerScrimClass: ComputedRef<string>
	headerBlurClass: ComputedRef<string>
	headerActionButtonClass: ComputedRef<string>
	headerLoginButtonClass: ComputedRef<string>
	headerMenuActionClass: ComputedRef<string>
	headerUserMenuButtonClass: ComputedRef<string>
	headerUserMenuChevronClass: ComputedRef<string>
	activeNavItemClass: ComputedRef<string>
	fallbackNavItemClass: ComputedRef<string>
	inactiveNavItemClass: ComputedRef<string>
}

const themeIconMap = {
	light: 'i-lucide-sun',
	dark: 'i-lucide-moon',
} as const

const getThemeModeIcon = (mode: ThemeMode): string =>
	mode === 'system' ? 'i-lucide-monitor' : themeIconMap[mode]

export const useHeaderAppearance = (): HeaderAppearanceState => {
	const route = useRoute()
	const colorMode = useNuxtApp().$colorMode

	const usesHeroVideoHeaderChrome = computed(
		() =>
			resolvePageBackground(route) === 'map' ||
			resolveHeaderVariant(route) === 'hero' ||
			hasHeroVideoBackground(route),
	)

	const selectedThemeMode = computed<ThemeMode>(() => {
		const pref = colorMode.preference

		return pref === 'light' || pref === 'dark' || pref === 'system'
			? pref
			: 'system'
	})

	const themeButtonIcon = computed(() =>
		getThemeModeIcon(selectedThemeMode.value),
	)

	const activeNavTextClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'text-[rgb(125,211,252)]'
			: 'text-primary dark:text-[rgb(125,211,252)]',
	)

	const headerScrimClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'bg-[linear-gradient(to_bottom,rgba(25,32,36,0.3)_0%,rgba(25,32,36,0.28)_18%,rgba(25,32,36,0.24)_32%,rgba(25,32,36,0.18)_46%,rgba(25,32,36,0.1)_60%,rgba(25,32,36,0.04)_72%,rgba(25,32,36,0.01)_84%,transparent_92%)]'
			: 'bg-[linear-gradient(to_bottom,rgba(250,250,250,0.94)_0%,rgba(250,250,250,0.88)_18%,rgba(250,250,250,0.72)_32%,rgba(250,250,250,0.5)_46%,rgba(250,250,250,0.27)_60%,rgba(250,250,250,0.1)_72%,rgba(250,250,250,0.02)_84%,transparent_92%)] dark:bg-[linear-gradient(to_bottom,rgba(25,32,36,0.88)_0%,rgba(25,32,36,0.8)_18%,rgba(25,32,36,0.65)_32%,rgba(25,32,36,0.45)_46%,rgba(25,32,36,0.25)_60%,rgba(25,32,36,0.1)_72%,rgba(25,32,36,0.02)_84%,transparent_92%)]',
	)

	const headerBlurClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'backdrop-blur-[12px]'
			: 'backdrop-blur-[8px] dark:backdrop-blur-[12px]',
	)

	const headerActionButtonClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'h-9 w-9 rounded-full text-white hover:bg-white/10 hover:text-white active:bg-white/20'
			: 'h-9 w-9 rounded-full hover:bg-slate-500/10 active:bg-slate-500/20',
	)

	const headerLoginButtonClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'text-white! hover:text-white!'
			: 'text-slate-700! hover:text-slate-950! dark:text-slate-100! dark:hover:text-white!',
	)

	const headerMenuActionClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'text-white! hover:text-white!'
			: 'text-slate-800! hover:text-slate-800! dark:text-slate-100! dark:hover:text-slate-100!',
	)

	const headerUserMenuButtonClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'text-white hover:text-white'
			: 'text-default',
	)

	const headerUserMenuChevronClass = computed(() =>
		usesHeroVideoHeaderChrome.value ? 'text-white' : 'text-default',
	)

	const activeNavItemClass = computed(
		() => `font-semibold ${activeNavTextClass.value} opacity-100`,
	)

	const fallbackNavItemClass = computed(
		() => `${activeNavTextClass.value} opacity-100`,
	)

	const inactiveNavItemClass = computed(() =>
		usesHeroVideoHeaderChrome.value
			? 'text-white opacity-80 hover:text-white hover:opacity-100'
			: 'text-slate-800 opacity-85 hover:text-slate-800 hover:opacity-100 dark:text-slate-300 dark:opacity-75 dark:hover:text-slate-100 dark:hover:opacity-100',
	)

	return {
		usesHeroVideoHeaderChrome,
		selectedThemeMode,
		themeButtonIcon,
		headerScrimClass,
		headerBlurClass,
		headerActionButtonClass,
		headerLoginButtonClass,
		headerMenuActionClass,
		headerUserMenuButtonClass,
		headerUserMenuChevronClass,
		activeNavItemClass,
		fallbackNavItemClass,
		inactiveNavItemClass,
	}
}
