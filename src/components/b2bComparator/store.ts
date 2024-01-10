import {AnnualEntrepreneurCalculator} from 'components/selfEmployment/logic/AnnualEntrepreneurCalculator'
import {InputFields as EntrepreneurInputFields} from 'components/selfEmployment/interfaces/InputFields'
import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {InputFields} from 'components/b2bComparator/interfaces/InputFields'
import {acceptHMRUpdate, defineStore} from 'pinia'

type Store = {
  monthlyInputFields: InputFields[] | undefined
}

function defaultInputFields(store: Store, taxSystem: EntrepreneurTaxSystem) {
  const monthlyInputFields: EntrepreneurInputFields[] = []

  if(!store.monthlyInputFields) {
    return undefined
  }

  for(let i = 0; i < 12; i++) {
    monthlyInputFields.push({
      ...store.monthlyInputFields[i],
      lossFromPreviousMonth: 0,
      taxSystem: taxSystem,
      yearlyIncome: 0,
      businessIsRunning: true,
      monthIndex: i,
    })
  }

  return monthlyInputFields
}

export const useB2BComparatorStore = defineStore('b2bComparator', {
  state: ():Store => ({
    monthlyInputFields:  undefined,
  }),
  getters: {
    taxScaleResult(state) {
      const inputData = defaultInputFields(state, EntrepreneurTaxSystem.TaxScale)
      if(inputData === undefined) {
        return undefined
      }
      return new AnnualEntrepreneurCalculator().setInputData(inputData).calculate().getResult()
    },
    flatTaxResult(state) {
      const inputData = defaultInputFields(state, EntrepreneurTaxSystem.FlatTax)
      if(inputData === undefined) {
        return undefined
      }
      return new AnnualEntrepreneurCalculator().setInputData(inputData).calculate().getResult()
    },
    lumpSUmTaxResult(state) {
      const inputData = defaultInputFields(state, EntrepreneurTaxSystem.LumpSumTax)
      if(inputData === undefined) {
        return undefined
      }
      return new AnnualEntrepreneurCalculator().setInputData(inputData).calculate().getResult()
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useB2BComparatorStore, import.meta.hot))
}
