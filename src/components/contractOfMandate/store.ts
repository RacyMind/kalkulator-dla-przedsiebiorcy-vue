import {AnnualEmployeeCalculator} from 'components/contractOfMandate/logic/AnnualEmployeeCalculator'
import {AnnualEmployerCalculator} from 'components/contractOfMandate/logic/AnnualEmployerCalculator'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  monthlyInputFields: InputFields[] | undefined
}

export const useMandateContractStore = defineStore('mandateContractStore', {
  state: ():Store => ({
    monthlyInputFields:  undefined,
  }),
  getters: {
    annualEmployeeResult(state) {
      if(state.monthlyInputFields === undefined) {
        return undefined
      }
      return new AnnualEmployeeCalculator().setInputData(state.monthlyInputFields).calculate().getResult()
    },
    annualEmployerResult(state) {
      if(state.monthlyInputFields === undefined) {
        return undefined
      }
      return new AnnualEmployerCalculator().setInputData(state.monthlyInputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMandateContractStore, import.meta.hot))
}
