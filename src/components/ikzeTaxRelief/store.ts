import {IkzeTaxReliefCalculator} from 'components/ikzeTaxRelief/logic/IkzeTaxReliefCalculator'
import {InputFields} from 'components/ikzeTaxRelief/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useIkzeTaxReliefStore = defineStore('ikzeTaxReliefStore', {
  state: (): Store => ({
    inputFields: undefined,
  }),
  getters: {
    result(state) {
      if (state.inputFields === undefined) {
        return undefined
      }
      return new IkzeTaxReliefCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIkzeTaxReliefStore, import.meta.hot))
}
