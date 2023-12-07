import {AnnualEmployeeCalculator} from 'components/contractOfEmployment/logic/AnnualEmployeeCalculator'
import {AnnualEmployerCalculator} from 'components/contractOfEmployment/logic/AnnualEmployerCalculator'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  monthlyInputFields: InputFields[] | undefined
}

export const useEmploymentContractStore = defineStore('mandateContractStore', {
  state: ():Store => ({
    monthlyInputFields:  undefined,
  }),
  getters: {
    employeeResult(state) {
      if(state.monthlyInputFields === undefined) {
        return undefined
      }
      return new AnnualEmployeeCalculator().setInputData(state.monthlyInputFields).calculate().getResult()
    },
    employerResult(state) {
      if(state.monthlyInputFields === undefined) {
        return undefined
      }
      return new AnnualEmployerCalculator().setInputData(state.monthlyInputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmploymentContractStore, import.meta.hot))
}
