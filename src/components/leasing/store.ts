import { LeasingCalculator } from 'components/leasing/logic/LeasingCalculator'
import { InputFields } from 'components/leasing/interfaces/InputFields'
import { acceptHMRUpdate, defineStore } from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useLeasingStore = defineStore('leasingStore', {
  state: (): Store => ({
    inputFields: undefined,
  }),
  getters: {
    result(state) {
      if (state.inputFields === undefined) {
        return undefined
      }
      return new LeasingCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLeasingStore, import.meta.hot))
}
