import {Store} from 'pinia'
import {useSettingStore} from 'stores/settingStore'
import {watch} from 'vue'

export const useLawRuleDate = () => {
  const availableDates = [
    {
      label: 'Listopad 2023',
      value: new Date(2023,  10, 1),
    },
    {
      label: 'Styczeń 2024',
      value: new Date(2024,  0, 1),
    },
  ]

  return {
    availableDates,
  }
}
export const lawRuleDateWatcher = (store:Store) => {
  const setttingStore = useSettingStore()
  watch(() => setttingStore.dateOfLawRules, () => {
    store.$reset()
  })
}
