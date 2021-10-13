import { computed } from 'vue'
import contractOfMandate from 'src/logic/contractOfMandate'
import { inputData } from './inputData'

export function useMonthlyEmployeeResult () {
  const {
    grossAmount,
    employeePPkContributionRate,
    partOfWorkWithAuthorExpenses,
    isPensionContribution,
    isRentContribution,
    isSickContribution,
    isHealthContribution,
    isYoung,
  } = inputData()

  const result = computed(fu => {
    return contractOfMandate.getMonthlyResultOfEmployee(
      grossAmount.value,
      employeePPkContributionRate.value,
      partOfWorkWithAuthorExpenses.value,
      isPensionContribution.value,
      isRentContribution.value,
      isSickContribution.value,
      isHealthContribution.value,
      isYoung.value,
    )
  })

  return {
    result,
    grossAmount,
  }
}
