export default {
  setGrossAmount (state, grossAmount) {
    state.grossAmount = grossAmount
  },
  setAccidentContributionRate (state, accidentContributionRate) {
    state.accidentContributionRate = accidentContributionRate
  },
  setPpkEmployeeContributionRate (state, ppkEmployeeContributionRate) {
    state.ppkEmployeeContributionRate = ppkEmployeeContributionRate
  },
  setPpkEmployerContributionRate (state, ppkEmployerContributionRate) {
    state.ppkEmployerContributionRate = ppkEmployerContributionRate
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
    state.ppkEmployeeContributionRate = 0
    state.ppkEmployerContributionRate = 0
    state.partOfWorkWithAuthorExpenses = 0
    state.isPensionContribution = false
    state.isRentContribution = false
    state.isSickContribution = false
    state.isHealthContribution = false
    state.isYoung = false
  },
}
