import {acceptHMRUpdate, defineStore} from 'pinia'

export type Settings = {
  dateOfLawRules: Date
}

const getDefaultDate = () => {
  const now = new Date()

  if(now.getFullYear() <= 2023) {
    return new Date(2023,  10, 1)
  }
  return new Date(2024,  0, 1)
}

export const useSettingStore = defineStore('settingStore', {
  state: ():Settings => (
    {
    dateOfLawRules: getDefaultDate(),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
