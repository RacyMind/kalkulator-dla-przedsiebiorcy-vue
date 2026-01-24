import { IkeSavingsCalculator } from './logic/IkeSavingsCalculator'
import { InputFields } from './interfaces/InputFields'
import { Result } from './interfaces/Result'
import { defineStore } from 'pinia'

interface IkeSavingsState {
  inputFields: InputFields | undefined
}

export const useIkeSavingsStore = defineStore('ikeSavingsStore', {
  state: (): IkeSavingsState => ({
    inputFields: undefined,
  }),
  getters: {
    result(state): Result | undefined {
      if (state.inputFields === undefined) {
        return undefined
      }
      return new IkeSavingsCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
})
