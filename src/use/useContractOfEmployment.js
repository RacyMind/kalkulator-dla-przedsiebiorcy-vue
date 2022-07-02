import { useStore } from 'vuex'
import { computed, reactive, watch, toRef } from 'vue'
import contractOfEmployment from 'src/logic/contractOfEmployment'

function setWatchers (props) {
  const year = toRef(props, 'year')
  watch(year, () => {
    contractOfEmployment.setYear(year.value)
  }, { immediate: true })
}

export function inputData () {
  const store = useStore()
  const grossAmount = computed(() => store.getters['contractOfEmployment/grossAmount'])
  const employerPpkContributionRate = computed(() => store.getters['contractOfEmployment/employerPpkContributionRate'])
  const employeePPkContributionRate = computed(() => store.getters['contractOfEmployment/employeePPkContributionRate'])
  const partOfWorkWithAuthorExpenses = computed(() => store.getters['contractOfEmployment/partOfWorkWithAuthorExpenses'])
  const workInLivePlace = computed(() => store.getters['contractOfEmployment/workInLivePlace'])
  const isFreeAmount = computed(() => store.getters['contractOfEmployment/isFreeAmount'])
  const isFpContribution = computed(() => store.getters['contractOfEmployment/isFpContribution'])
  const isYoung = computed(() => store.getters['contractOfEmployment/isYoung'])
  const accidentContributionRate = computed(() => store.getters['contractOfEmployment/accidentContributionRate'])
  const isAidForBigFamily = computed(() => store.getters['contractOfEmployment/isAidForBigFamily'])
  const isAidForSenior = computed(() => store.getters['contractOfEmployment/isAidForSenior'])
  const isAidForMiddleClass = computed(() => store.getters['contractOfEmployment/isAidForMiddleClass'])

  return {
    accidentContributionRate,
    employeePPkContributionRate,
    employerPpkContributionRate,
    grossAmount,
    isAidForBigFamily,
    isAidForMiddleClass,
    isAidForSenior,
    isFpContribution,
    isFreeAmount,
    isYoung,
    partOfWorkWithAuthorExpenses,
    workInLivePlace,
  }
}

export function useMonthlyEmployeeResult (props) {
  setWatchers(props)

  const {
    grossAmount,
    employeePPkContributionRate,
    partOfWorkWithAuthorExpenses,
    workInLivePlace,
    isFreeAmount,
    isFpContribution,
    isYoung,
    isAidForBigFamily,
    isAidForSenior,
    isAidForMiddleClass,
  } = inputData()

  const result = computed(() => {
    contractOfEmployment.resetTotalAmounts()
    return contractOfEmployment.getMonthlyResultOfEmployee(
      grossAmount.value,
      employeePPkContributionRate.value,
      partOfWorkWithAuthorExpenses.value,
      workInLivePlace.value,
      isFreeAmount.value,
      isFpContribution.value,
      isYoung.value,
      isAidForBigFamily.value,
      isAidForSenior.value,
      isAidForMiddleClass.value,
    )
  })

  return {
    result,
  }
}

export function useYearlyEmployeeResult (props) {
  setWatchers(props)

  const {
    grossAmount,
    employeePPkContributionRate,
    partOfWorkWithAuthorExpenses,
    workInLivePlace,
    isFreeAmount,
    isFpContribution,
    isYoung,
    employerPpkContributionRate,
    isAidForBigFamily,
    isAidForSenior,
    isAidForMiddleClass,
  } = inputData()

  const monthlyInputs = reactive([])

  const updateMonthlyInputs = () => {
    for (let i = 0; i < 12; i++) {
      monthlyInputs[i] = {
        employeePPkContributionRate: employeePPkContributionRate.value,
        employerPpkContributionRate: employerPpkContributionRate.value,
        grossAmount: grossAmount.value,
        isAidForBigFamily: isAidForBigFamily.value,
        isAidForMiddleClass: isAidForMiddleClass.value,
        isAidForSenior: isAidForSenior.value,
        isFpContribution: isFpContribution.value,
        isFreeAmount: isFreeAmount.value,
        isYoung: isYoung.value,
        partOfWorkWithAuthorExpenses: partOfWorkWithAuthorExpenses.value,
        workInLivePlace: workInLivePlace.value,
      }
    }
  }

  updateMonthlyInputs()

  const results = computed(() => {
    return contractOfEmployment.getYearlyResultOfEmployee(monthlyInputs)
  })

  return {
    monthlyInputs,
    results,
  }
}

export function useMonthlyEmployerResult (props) {
  setWatchers(props)

  const {
    grossAmount,
    accidentContributionRate,
    employerPpkContributionRate,
    isFpContribution,
  } = inputData()

  const result = computed(() => {
    contractOfEmployment.resetTotalAmounts()
    return contractOfEmployment.getMonthlyResultOfEmployer(
      grossAmount.value,
      accidentContributionRate.value,
      employerPpkContributionRate.value,
      isFpContribution.value,
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
    accidentContributionRate,
    employerPpkContributionRate,
    isFpContribution,
  } = inputData()

  const monthlyInputs = reactive([])

  const updateMonthlyInputs = () => {
    for (let i = 0; i < 12; i++) {
      monthlyInputs[i] = {
        accidentContributionRate: accidentContributionRate.value,
        employerPpkContributionRate: employerPpkContributionRate.value,
        grossAmount: grossAmount.value,
        isFpContribution: isFpContribution.value,
      }
    }
  }

  updateMonthlyInputs()

  const results = computed(() => {
    return contractOfEmployment.getYearlyResultOfEmployer(monthlyInputs)
  })

  return {
    monthlyInputs,
    results,
  }
}
