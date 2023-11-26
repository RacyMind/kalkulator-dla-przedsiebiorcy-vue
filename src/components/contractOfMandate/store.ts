import {AnnualEmployeeCalculator} from 'components/contractOfMandate/logic/AnnualEmployeeCalculator'
import {AnnualEmployerCalculator} from 'components/contractOfMandate/logic/AnnualEmployerCalculator'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields[] | undefined
}

export const useMandateContractStore = defineStore('mandateContractStore', {
  state: ():Store => ({
    inputFields:  undefined,
  }),
  getters: {
    annualEmployeeResult(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new AnnualEmployeeCalculator().setInputData(state.inputFields).calculate().getResult()
    },
    annualEmployerResult(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new AnnualEmployerCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMandateContractStore, import.meta.hot))
}
