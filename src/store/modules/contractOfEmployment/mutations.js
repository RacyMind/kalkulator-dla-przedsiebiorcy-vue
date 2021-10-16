export default {
  setGrossAmount (state, grossAmount) {
    state.grossAmount = grossAmount
  },
  setAccidentContributionRate (state, accidentContributionRate) {
    state.accidentContributionRate = accidentContributionRate
  },
  setEmployeePPkContributionRate (state, employeePPkContributionRate) {
    state.employeePPkContributionRate = employeePPkContributionRate
  },
  setEmployerPpkContributionRate (state, employerPpkContributionRate) {
    state.employerPpkContributionRate = employerPpkContributionRate
  },
  setPartOfWorkWithAuthorExpenses (state, partOfWorkWithAuthorExpenses) {
    state.partOfWorkWithAuthorExpenses = partOfWorkWithAuthorExpenses
  },
  setIsYoung (state, isYoung) {
    state.isYoung = isYoung
  },
  setWorkInLivePlace (state, workInLivePlace) {
    state.workInLivePlace = workInLivePlace
  },
  setIsFreeAmount (state, isFreeAmount) {
    state.isFreeAmount = isFreeAmount
  },
  setIsFpContribution (state, isFpContribution) {
    state.isFpContribution = isFpContribution
  },
  resetData (state) {
    state.grossAmount = null
    state.accidentContributionRate = 0
    state.employeePPkContributionRate = 0
    state.employerPpkContributionRate = 0
    state.partOfWorkWithAuthorExpenses = 0
    state.isYoung = false
    state.workInLivePlace = false
    state.isFreeAmount = false
    state.isFpContribution = false
  },
}
