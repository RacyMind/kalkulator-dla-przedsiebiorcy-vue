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

  return {
    grossAmount,
    employeePPkContributionRate,
    partOfWorkWithAuthorExpenses,
    workInLivePlace,
    isFreeAmount,
    isFpContribution,
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
    workInLivePlace,
    isFreeAmount,
    isFpContribution,
    isYoung,
  } = inputData()

  const result = computed(fu => {
    return contractOfEmployment.getMonthlyResultOfEmployee(
      grossAmount.value,
      employeePPkContributionRate.value,
      partOfWorkWithAuthorExpenses.value,
      workInLivePlace.value,
      isFreeAmount.value,
      isFpContribution.value,
      isYoung.value,
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
  } = inputData()

  const monthlyInputs = reactive([])

  const updateMonthlyInputs = () => {
    for (let i = 0; i < 12; i++) {
      monthlyInputs[i] = {
        grossAmount: grossAmount.value,
        employeePPkContributionRate: employeePPkContributionRate.value,
        partOfWorkWithAuthorExpenses: partOfWorkWithAuthorExpenses.value,
        workInLivePlace: workInLivePlace.value,
        isFreeAmount: isFreeAmount.value,
        isFpContribution: isFpContribution.value,
        isYoung: isYoung.value,
        employerPpkContributionRate: employerPpkContributionRate.value,
      }
    }
  }

  updateMonthlyInputs()

  let results = computed(fu => {
    return contractOfEmployment.getYearlyResultOfEmployee(monthlyInputs)
  })

  watch(monthlyInputs, () => {
    results = contractOfEmployment.getYearlyResultOfEmployee(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
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

  const result = computed(fu => {
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
        grossAmount: grossAmount.value,
        accidentContributionRate: accidentContributionRate.value,
        employerPpkContributionRate: employerPpkContributionRate.value,
        isFpContribution: isFpContribution.value,
      }
    }
  }

  updateMonthlyInputs()

  let results = computed(fu => {
    return contractOfEmployment.getYearlyResultOfEmployer(monthlyInputs)
  })

  watch(monthlyInputs, () => {
    results = contractOfEmployment.getYearlyResultOfEmployer(monthlyInputs)
  })

  return {
    results,
    monthlyInputs,
  }
}
