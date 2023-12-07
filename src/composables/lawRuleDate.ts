import {useSettingStore} from 'stores/settingStore'

export const useLawRuleDate = () => {
  const availableDates = [
    {
      label: 'Listopad 2023',
      value: new Date(2023,  10, 1),
    },
  ]

  const store = useSettingStore()
  store.dateOfLawRules = availableDates[0].value

  return {
    availableDates,
    lawRuleDate: store.dateOfLawRules,
  }
}
