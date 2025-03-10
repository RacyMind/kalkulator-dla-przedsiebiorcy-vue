export const useBondConstants =() => {
  return {
    bondCost: 100,
    ots:{
      interestRate: 0.03,
    },
    ror:{
      nbpRateMargin: 0.0, // NBP reference rate + 0.00% for subsequent months
    },
    dor:{
      nbpRateMargin: 0.0015, // NBP reference rate + 0.15% for subsequent months
    },
    tos:{
      interestRate: 0.0595, // 5.95% fixed interest rate for TOS bonds
    },
    coi: {
      initialInterestRate: 0.0655, // 6.55% in the first period
      inflationMargin: 0.015, // Inflation + 1.50%
    },
    edo: {
      inflationMargin: 0.02, // Inflation + 2%
    },
  }
}
