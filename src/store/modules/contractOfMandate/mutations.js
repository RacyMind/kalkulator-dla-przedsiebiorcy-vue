export default {
  setGrossAmount (state, grossAmount) {
    state.grossAmount = grossAmount
  },
  setAccidentContributionRate (state, accidentContributionRate) {
    state.accidentContributionRate = accidentContributionRate
  },
  setemployeePPkContributionRate (state, employeePPkContributionRate) {
    state.employeePPkContributionRate = employeePPkContributionRate
  },
  setemployerPpkContributionRate (state, employerPpkContributionRate) {
    state.employerPpkContributionRate = employerPpkContributionRate
  },
  setPartOfWorkWithAuthorExpenses (state, partOfWorkWithAuthorExpenses) {
    state.partOfWorkWithAuthorExpenses = partOfWorkWithAuthorExpenses
  },
  setIsPensionContribution (state, isPensionContribution) {
    state.isPensionContribution = isPensionContribution
  },
  setIsRentContribution (state, isRentContribution) {
    state.isRentContribution = isRentContribution
  },
  setIsSickContribution (state, isSickContribution) {
    state.isSickContribution = isSickContribution
  },
  setIsHealthContribution (state, isHealthContribution) {
    state.isHealthContribution = isHealthContribution
  },
  setIsYoung (state, isYoung) {
    state.isYoung = isYoung
  },
  clearData (state) {
    state.grossAmount = null
    state.accidentContributionRate = 0
    state.employeePPkContributionRate = 0
    state.employerPpkContributionRate = 0
    state.partOfWorkWithAuthorExpenses = 0
    state.isPensionContribution = false
    state.isRentContribution = false
    state.isSickContribution = false
    state.isHealthContribution = false
    state.isYoung = false
  },
}
