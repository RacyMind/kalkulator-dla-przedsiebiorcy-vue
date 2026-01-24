export const useBondConstants =() => {
  return {
    bondCost: 100,
    yearlyInflationRate: 0.036,
    ots:{
      interestRate: 0.025,
    },
    ror:{
      nbpReferenceRate: 0.04,
      nbpRateMargin: 0.0,
      initialInterestRate: 0.0425,
      initialNbpReferenceRates: Array(12).fill(0.04),
    },
    dor:{
      nbpReferenceRate: 0.04,
      nbpRateMargin: 0.0015,
      initialInterestRate: 0.044,
      initialNbpReferenceRates: Array(24).fill(0.04),
    },
    tos:{
      interestRate: 0.0465,
    },
    coi: {
      initialInterestRate: 0.05,
      inflationMargin: 0.015,
    },
    edo: {
      initialInterestRate: 0.056,
      inflationMargin: 0.02,
    },
  }
}
