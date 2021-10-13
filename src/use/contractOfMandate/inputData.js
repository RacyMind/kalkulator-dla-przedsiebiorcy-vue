import { useStore } from 'vuex'
import { computed } from 'vue'

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
