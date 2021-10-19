export default {
  grossAmount: (state) => state.grossAmount,
  taxType: (state) => state.taxType,
  taxRateForLumpSum: (state) => state.taxRateForLumpSum,
  accidentContributionRate: (state) => state.accidentContributionRate,
  expenses: (state) => state.expenses,
  isFreeAmount: (state) => state.isFreeAmount,
  isSickContribution: (state) => state.isSickContribution,
  isFpContribution: (state) => state.isFpContribution,
  isSmallZus: (state) => state.isSmallZus,
  isAidForStart: (state) => state.isAidForStart,
  isFullTimeJob: (state) => state.isFullTimeJob,
  customBasisForZus: (state) => state.customBasisForZus,
}
