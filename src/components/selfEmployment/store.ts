import {AnnualEntrepreneurCalculator} from 'components/selfEmployment/logic/AnnualEntrepreneurCalculator'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  monthlyInputFields: InputFields[] | undefined
}

export const useSelfEmploymentStore = defineStore('selfemployment', {
  state: ():Store => ({
    monthlyInputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.monthlyInputFields === undefined) {
        return undefined
      }
      return new AnnualEntrepreneurCalculator().setInputData(state.monthlyInputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelfEmploymentStore, import.meta.hot))
}
