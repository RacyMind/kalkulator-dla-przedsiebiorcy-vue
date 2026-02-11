import { acceptHMRUpdate, defineStore } from 'pinia'
import { InputFields } from 'components/pfronRefund/interfaces/InputFields'
import { PfronRefundCalculator } from 'components/pfronRefund/logic/PfronRefundCalculator'

type Store = {
  inputFields: InputFields | undefined
}

export const usePfronRefundStore = defineStore('pfronRefundStore', {
  state: (): Store => ({
    inputFields: undefined,
  }),
  getters: {
    result(state) {
      if (state.inputFields === undefined) {
        return undefined
      }
      return new PfronRefundCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePfronRefundStore, import.meta.hot))
}
