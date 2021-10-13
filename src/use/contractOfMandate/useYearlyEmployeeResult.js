import { computed, reactive, watch } from 'vue'
import contractOfMandate from 'src/logic/contractOfMandate'
import { inputData } from './inputData'

export function useYearlyEmployeeResult () {
  const {
    grossAmount,
    employeePPkContributionRate,
    partOfWorkWithAuthorExpenses,
    isPensionContribution,
    isRentContribution,
    isSickContribution,
    isHealthContribution,
    isYoung,
    employerPpkContributionRate,
  } = inputData()

  const monthlyInputs = reactive([])

  const updateMonthlyInputs = () => {
    for (let i = 0; i < 12; i++) {
      monthlyInputs[i] = {
        grossAmount: grossAmount.value,
        employeePPkContributionRate: employeePPkContributionRate.value,
        partOfWorkWithAuthorExpenses: partOfWorkWithAuthorExpenses.value,
        isPensionContribution: isPensionContribution.value,
        isRentContribution: isRentContribution.value,
        isSickContribution: isSickContribution.value,
        isHealthContribution: isHealthContribution.value,
        isYoung: isYoung.value,
        employerPpkContributionRate: employerPpkContributionRate.value,
      }
    }
  }

  updateMonthlyInputs()

  let results = computed(fu => {
    return contractOfMandate.getYearlyResultOfEmployee(monthlyInputs)
  })

  watch(monthlyInputs, () => {
    results = contractOfMandate.getYearlyResultOfEmployee(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
    isYoung,
    employerPpkContributionRate,
  }
}
