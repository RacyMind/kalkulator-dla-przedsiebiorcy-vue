import {Ref} from 'vue'
import {acceptHMRUpdate, defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'

export type Settings = {
  dateOfLawRules: Ref<Date>
}

const getDefaultDate = () => {
  const now = new Date()

  if(now.getFullYear() <= 2023) {
    return new Date(2023,  10, 1)
  }
  return new Date(now.getFullYear(),  0, 1)
}

export const useSettingStore = defineStore('settingStore', {
  state: ():Settings => (
    {
    dateOfLawRules: useLocalStorage('dateOfLawRules', getDefaultDate(), { mergeDefaults: true }),
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
