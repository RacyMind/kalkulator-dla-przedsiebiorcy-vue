import { useStore } from 'vuex'
import { computed, reactive, watch, toRef } from 'vue'
import contractOfMandate from 'src/logic/contractOfMandate'

function setWatchers (props) {
  const year = toRef(props, 'year')
  watch(year, () => {
    contractOfMandate.setYear(year.value)
  }, { immediate: true })
}

export function inputData () {
  const store = useStore()
  const grossAmount = computed(() => store.getters['contractOfMandate/grossAmount'])
  const employerPpkContributionRate = computed(() => store.getters['contractOfMandate/employerPpkContributionRate'])
  const employeePPkContributionRate = computed(() => store.getters['contractOfMandate/employeePPkContributionRate'])
  const partOfWorkWithAuthorExpenses = computed(() => store.getters['contractOfMandate/partOfWorkWithAuthorExpenses'])
  const isPensionContribution = computed(() => store.getters['contractOfMandate/isPensionContribution'])
  const isRentContribution = computed(() => store.getters['contractOfMandate/isRentContribution'])
  const isSickContribution = computed(() => store.getters['contractOfMandate/isSickContribution'])
  const isHealthContribution = computed(() => store.getters['contractOfMandate/isHealthContribution'])
  const isYoung = computed(() => store.getters['contractOfMandate/isYoung'])
  const accidentContributionRate = computed(() => store.getters['contractOfMandate/accidentContributionRate'])

  return {
    grossAmount,
    employeePPkContributionRate,
    partOfWorkWithAuthorExpenses,
    isPensionContribution,
    isRentContribution,
    isSickContribution,
    isHealthContribution,
    isYoung,
    employerPpkContributionRate,
    accidentContributionRate,
  }
}

export function useMonthlyEmployeeResult (props) {
  setWatchers(props)

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
    contractOfMandate.resetTotalAmounts()
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

export function useYearlyEmployeeResult (props) {
  setWatchers(props)

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

  const results = computed(() => {
    return contractOfMandate.getYearlyResultOfEmployee(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
    isYoung,
    employerPpkContributionRate,
  }
}

export function useMonthlyEmployerResult (props) {
  setWatchers(props)

  const {
    grossAmount,
    employerPpkContributionRate,
    accidentContributionRate,
    isPensionContribution,
    isRentContribution,
  } = inputData()

  const result = computed(() => {
    contractOfMandate.resetTotalAmounts()
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

export function useYearlyEmployerResult (props) {
  setWatchers(props)

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

  const results = computed(() => {
    return contractOfMandate.getYearlyResultOfEmployer(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
  }
}
