import {acceptHMRUpdate, defineStore} from 'pinia'

export type Settings = {
  dateOfLawRules: Date
}

export const useSettingStore = defineStore('settingStore', {
  state: ():Settings => (
    {
    dateOfLawRules: new Date(2023,  10, 1),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
