import { computed, reactive, watch } from 'vue'
import contractOfMandate from 'src/logic/contractOfMandate'
import { inputData } from './inputData'

export function useYearlyEmployerResult () {
  const {
    grossAmount,
    employerPpkContributionRate,
    accidentContributionRate,
    isPensionContribution,
    isRentContribution,
  } = inputData()

  const monthlyInputs = reactive([])

  const updateMonthlyInputs = () => {
    for (let i = 0; i < 12; i++) {
      monthlyInputs[i] = {
        grossAmount: grossAmount.value,
        accidentContributionRate: accidentContributionRate.value,
        employerPpkContributionRate: employerPpkContributionRate.value,
        isPensionContribution: isPensionContribution.value,
        isRentContribution: isRentContribution.value,
      }
    }
  }

  updateMonthlyInputs()

  let results = computed(fu => {
    return contractOfMandate.getYearlyResultOfEmployer(monthlyInputs)
  })

  watch(monthlyInputs, () => {
    results = contractOfMandate.getYearlyResultOfEmployer(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
  }
}
