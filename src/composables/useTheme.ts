import {computed, watch, nextTick} from 'vue'
import {storeToRefs} from 'pinia'
import {usePreferredColorScheme} from '@vueuse/core'
import {Dark} from 'quasar'
import {useSettingStore, type ThemeMode} from 'src/stores/settingStore'
import {useChartColors} from 'src/composables/useChartColors'

const THEME_CYCLE: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'auto',
  auto: 'light',
}

const THEME_ICONS: Record<ThemeMode, string> = {
  light: 'light_mode',
  dark: 'dark_mode',
  auto: 'brightness_auto',
}

const THEME_TOOLTIPS: Record<ThemeMode, string> = {
  light: 'Tryb jasny',
  dark: 'Tryb ciemny',
  auto: 'Tryb automatyczny',
}

export function useTheme() {
  const settingStore = useSettingStore()
  const {themeMode} = storeToRefs(settingStore)
  const preferredColor = usePreferredColorScheme()
  const {refresh: refreshChartColors} = useChartColors()

  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (themeMode.value === 'auto') {
      return preferredColor.value === 'dark' ? 'dark' : 'light'
    }
    return themeMode.value
  })

  const isDark = computed(() => effectiveTheme.value === 'dark')
  const themeIcon = computed(() => THEME_ICONS[themeMode.value])
  const themeTooltip = computed(() => THEME_TOOLTIPS[themeMode.value])

  function applyTheme() {
    if (themeMode.value === 'auto') {
      Dark.set('auto')
    } else {
      Dark.set(themeMode.value === 'dark')
    }
  }

  function cycleTheme() {
    themeMode.value = THEME_CYCLE[themeMode.value]
  }

  watch([themeMode, preferredColor], () => {
    applyTheme()
    nextTick(() => refreshChartColors())
  }, {immediate: true})

  return {
    themeMode,
    effectiveTheme,
    isDark,
    themeIcon,
    themeTooltip,
    cycleTheme,
  }
}
