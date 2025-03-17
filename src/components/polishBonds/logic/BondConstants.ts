export const useBondConstants =() => {
  return {
    bondCost: 100,
    yearlyInflationRate: 0.036,
    ots:{
      interestRate: 0.03,
    },
    ror:{
      nbpReferenceRate: 0.0575,
      nbpRateMargin: 0.0,
      initialInterestRate: 0.0575,
      initialNbpReferenceRates: Array(12).fill(0.0575),
    },
    dor:{
      nbpReferenceRate: 0.0575,
      nbpRateMargin: 0.0015,
      initialInterestRate: 0.0590,
      initialNbpReferenceRates: Array(24).fill(0.0590),
    },
    tos:{
      interestRate: 0.0595,
    },
    coi: {
      initialInterestRate: 0.0655,
      inflationMargin: 0.015,
    },
    edo: {
      initialInterestRate: 0.0655,
      inflationMargin: 0.02,
    },
    rod: {
      initialInterestRate: 0.068,
      inflationMargin: 0.025,
    },
    ros: {
      initialInterestRate: 0.065,
      inflationMargin: 0.02,
    },
  }
}
