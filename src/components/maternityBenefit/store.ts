import { MaternityBenefitCalculator } from 'components/maternityBenefit/logic/MaternityBenefitCalculator'
import { InputFields } from 'components/maternityBenefit/interfaces/InputFields'
import { acceptHMRUpdate, defineStore } from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const useMaternityBenefitStore = defineStore('maternityBenefitStore', {
  state: (): Store => ({
    inputFields: undefined,
  }),
  getters: {
    result(state) {
      if (state.inputFields === undefined) {
        return undefined
      }
      return new MaternityBenefitCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useMaternityBenefitStore, import.meta.hot),
  )
}
