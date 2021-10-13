import { computed } from 'vue'
import contractOfMandate from 'src/logic/contractOfMandate'
import { inputData } from './inputData'

export function useMonthlyEmployerResult () {
  const {
    grossAmount,
    employerPpkContributionRate,
    accidentContributionRate,
    isPensionContribution,
    isRentContribution,
  } = inputData()

  const result = computed(fu => {
    return contractOfMandate.getMonthlyResultOfEmployer(
      grossAmount.value,
      accidentContributionRate.value,
      employerPpkContributionRate.value,
      isPensionContribution.value,
      isRentContribution.value,
    )
  })
  return {
    result,
  }
}
