import {
  AnnuaUnregisteredCompanyCalculator,
} from 'components/unregisteredCompany/logic/AnnuaUnregisteredCompanyCalculator'
import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  monthlyInputFields: InputFields[] | undefined
}

export const useUnregisteredCompanyStore = defineStore('unregisteredCompany', {
  state: ():Store => ({
    monthlyInputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.monthlyInputFields === undefined) {
        return undefined
      }
      return new AnnuaUnregisteredCompanyCalculator().setInputData(state.monthlyInputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnregisteredCompanyStore, import.meta.hot))
}
