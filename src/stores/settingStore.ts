import {acceptHMRUpdate, defineStore} from 'pinia'

export type Settings = {
  dateOfLawRules: Date
}

export const useSettingStore = defineStore('settingStore', {
  state: ():Settings => ({
    dateOfLawRules: new Date(),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
