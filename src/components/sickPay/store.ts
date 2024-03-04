import {InputFields} from 'components/sickPay/interfaces/InputFields'
import {SickPayCalculator} from 'components/sickPay/logic/SickPayCalculator'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useSIckPayStore = defineStore('sickPay', {
  state: ():Store => ({
    inputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new SickPayCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSIckPayStore, import.meta.hot))
}
