import {ContractWorkCalculator} from 'components/contractWork/logic/ContractWorkCalculator'
import {InputFields} from 'components/contractWork/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useContractWorkStore = defineStore('contractWorkStore', {
  state: ():Store => ({
    inputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new ContractWorkCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContractWorkStore, import.meta.hot))
}
