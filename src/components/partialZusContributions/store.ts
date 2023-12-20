import {ContributionCalculator} from 'components/partialZusContributions/logic/ContributionCalculator'
import {InputFields} from 'components/partialZusContributions/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  inputFields: InputFields | undefined
}

export const usePartialZusContributionStore = defineStore('partialZusContributions', {
  state: ():Store => ({
    inputFields:  undefined,
  }),
  getters: {
    result(state) {
      if(state.inputFields === undefined) {
        return undefined
      }
      return new ContributionCalculator().setInputData(state.inputFields).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePartialZusContributionStore, import.meta.hot))
}
