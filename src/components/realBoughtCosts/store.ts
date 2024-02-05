import {InputFields} from 'components/realBoughtCosts/interfaces/InputFields'
import {RealBoughtCostCalculator} from 'components/realBoughtCosts/logic/RealBoughtCostCalculator'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useRealBoughtCostStore = defineStore('realBoughtCosts', {
  state: ():Store => ({
    inputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new RealBoughtCostCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRealBoughtCostStore, import.meta.hot))
}
