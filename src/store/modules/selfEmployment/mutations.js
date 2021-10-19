export default {
  setGrossAmount (state, grossAmount) {
    state.grossAmount = grossAmount
  },
  setTaxType (state, taxType) {
    state.taxType = taxType
  },
  setTaxRateForLumpSum (state, taxRateForLumpSum) {
    state.taxRateForLumpSum = taxRateForLumpSum
  },
  setAccidentContributionRate (state, accidentContributionRate) {
    state.accidentContributionRate = accidentContributionRate
  },
  setExpenses (state, expenses) {
    state.expenses = expenses
  },
  setIsFreeAmount (state, isFreeAmount) {
    state.isFreeAmount = isFreeAmount
  },
  setIsSickContribution (state, isSickContribution) {
    state.isSickContribution = isSickContribution
  },
  setIsFpContribution (state, isFpContribution) {
    state.isFpContribution = isFpContribution
  },
  setIsSmallZus (state, isSmallZus) {
    state.isSmallZus = isSmallZus
  },
  setIsAidForStart (state, isAidForStart) {
    state.isAidForStart = isAidForStart
  },
  setIsFullTimeJob (state, isFullTimeJob) {
    state.isFullTimeJob = isFullTimeJob
  },
  setCustomBasisForZus (state, customBasisForZus) {
    state.customBasisForZus = customBasisForZus
  },
  resetData (state) {
    state.grossAmount = null
    state.taxType = null
    state.taxRateForLumpSum = null
    state.accidentContributionRate = null
    state.expenses = null
    state.isFreeAmount = false
    state.isSickContribution = false
    state.isFpContribution = false
    state.isSmallZus = false
    state.isAid = false
    state.isFullTimeJob = false
    state.customBasisForZus = null
  },
}
