import { useStore } from 'vuex'
import { computed, reactive, watch, toRef } from 'vue'
import selfEmployment from 'src/logic/selfEmployment'

function setWatchers (props) {
  const year = toRef(props, 'year')
  watch(year, () => {
    selfEmployment.setYear(year.value)
  }, { immediate: true })
}

export function inputData () {
  const store = useStore()
  const grossAmount = computed(() => store.getters['selfEmployment/grossAmount'])
  const taxType = computed(() => store.getters['selfEmployment/taxType'])
  const taxRateForLumpSum = computed(() => store.getters['selfEmployment/taxRateForLumpSum'])
  const accidentContributionRate = computed(() => store.getters['selfEmployment/accidentContributionRate'])
  const expenses = computed(() => store.getters['selfEmployment/expenses'])
  const isFreeAmount = computed(() => store.getters['selfEmployment/isFreeAmount'])
  const isFpContribution = computed(() => store.getters['selfEmployment/isFpContribution'])
  const isSickContribution = computed(() => store.getters['selfEmployment/isSickContribution'])
  const isSmallZus = computed(() => store.getters['selfEmployment/isSmallZus'])
  const isAidForStart = computed(() => store.getters['selfEmployment/isAidForStart'])
  const isFullTimeJob = computed(() => store.getters['selfEmployment/isFullTimeJob'])
  const customBasisForZus = computed(() => store.getters['selfEmployment/customBasisForZus'])
  const isAidForBigFamily = computed(() => store.getters['selfEmployment/isAidForBigFamily'])
  const isAidForSenior = computed(() => store.getters['selfEmployment/isAidForSenior'])
  const isAidForMiddleClass = computed(() => store.getters['selfEmployment/isAidForMiddleClass'])

  return {
    grossAmount,
    taxType,
    taxRateForLumpSum,
    accidentContributionRate,
    expenses,
    isFreeAmount,
    isFpContribution,
    isSickContribution,
    isSmallZus,
    isAidForStart,
    isFullTimeJob,
    customBasisForZus,
    isAidForBigFamily,
    isAidForSenior,
    isAidForMiddleClass,
  }
}

export function useMonthlyResult (props) {
  setWatchers(props)

  const {
    grossAmount,
    taxType,
    taxRateForLumpSum,
    accidentContributionRate,
    expenses,
    isFreeAmount,
    isFpContribution,
    isSickContribution,
    isSmallZus,
    isAidForStart,
    isFullTimeJob,
    customBasisForZus,
    isAidForBigFamily,
    isAidForSenior,
    isAidForMiddleClass,
  } = inputData()

  const result = computed(fu => {
    return selfEmployment.getMonthlyResult(
      grossAmount.value,
      expenses.value,
      taxType.value,
      taxRateForLumpSum.value,
      isFreeAmount.value,
      accidentContributionRate.value,
      isFpContribution.value,
      isSickContribution.value,
      isSmallZus.value,
      isAidForStart.value,
      isFullTimeJob.value,
      customBasisForZus.value,
      isAidForBigFamily.value,
      isAidForSenior.value,
      isAidForMiddleClass.value,
    )
  })

  return {
    result,
  }
}

export function useYearlyResult (props) {
  setWatchers(props)

  const {
    grossAmount,
    taxType,
    taxRateForLumpSum,
    accidentContributionRate,
    expenses,
    isFreeAmount,
    isFpContribution,
    isSickContribution,
    isSmallZus,
    isAidForStart,
    isFullTimeJob,
    customBasisForZus,
    isAidForBigFamily,
    isAidForSenior,
    isAidForMiddleClass,
  } = inputData()

  const monthlyInputs = reactive([])

  const updateMonthlyInputs = () => {
    for (let i = 0; i < 12; i++) {
      monthlyInputs[i] = {
        grossAmount: grossAmount.value,
        expenses: expenses.value,
        taxType: taxType.value,
        taxRateForLumpSum: taxRateForLumpSum.value,
        isFreeAmount: isFreeAmount.value,
        accidentContributionRate: accidentContributionRate.value,
        isFpContribution: isFpContribution.value,
        isSickContribution: isSickContribution.value,
        isSmallZus: isSmallZus.value,
        isAidForStart: isAidForStart.value,
        isFullTimeJob: isFullTimeJob.value,
        customBasisForZus: customBasisForZus.value,
        isAidForBigFamily: isAidForBigFamily.value,
        isAidForSenior: isAidForSenior.value,
        isAidForMiddleClass: isAidForMiddleClass.value,
      }
    }
  }

  updateMonthlyInputs()

  const results = computed(fu => {
    selfEmployment.resetTotalAmounts()
    return selfEmployment.getYearlyResult(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
  }
}
