import {InputFields} from 'components/rentalProfit/interfaces/InputFields'
import {RentalProfitCalculator} from 'components/rentalProfit/logic/RentalProfitCalculator'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useRentalProfitStore = defineStore('rentalProfitStore', {
  state: (): Store => ({
    inputFields: undefined,
  }),
  getters: {
    result(state) {
      if (state.inputFields === undefined) {
        return undefined
      }
      return new RentalProfitCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRentalProfitStore, import.meta.hot))
}
