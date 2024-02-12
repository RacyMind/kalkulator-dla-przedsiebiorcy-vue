import {InputFields} from 'components/salaryForUnusedHolidays/interfaces/InputFields'
import {
  SalaryForUnusedHolidaysCalculator,
} from 'components/salaryForUnusedHolidays/logic/SalaryForUnusedHolidaysCalculator'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useSalaryForUnusedHolidayStore = defineStore('salaryForUnusedHolidays', {
  state: ():Store => ({
    inputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new SalaryForUnusedHolidaysCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalaryForUnusedHolidayStore, import.meta.hot))
}
