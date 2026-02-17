import { computed } from 'vue'
import { useQuasar } from 'quasar'

export function useResponsiveTabPanels() {
  const $q = useQuasar()

  const isMobileTabMode = computed(
    () => $q.platform.is.mobile || $q.screen.lt.md,
  )

  const tabPanelsKey = computed(() =>
    isMobileTabMode.value ? 'mobile' : 'desktop',
  )

  return {
    isMobileTabMode,
    tabPanelsKey,
  }
}
