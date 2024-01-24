import {FormFields} from 'components/accountingWithSpouse/interfaces/FormFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  husband: FormFields | undefined
  wife: FormFields | undefined
}

export const useAccountingWithSpouseStore = defineStore('accounting-with-spouse', {
  state: ():Store => ({
    husband: undefined,
    wife: undefined,
  }),
  getters: {
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountingWithSpouseStore, import.meta.hot))
}
