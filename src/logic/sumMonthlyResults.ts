import helpers from 'src/logic/helpers'

export interface MonthlyEmployeeResult {
  basisForRentAndPensionContributions: number
  basisForTax: number
  contributionTotal: number
  disabilityContribution: number
  expenses: number
  grossAmount: number
  healthContribution: number
  netAmount: number
  pensionContribution: number
  ppkContribution: number
  sickContribution: number
  taxAmount: number
}

export function sumMonthlyResults(monthlyResults: MonthlyEmployeeResult[]) {
  return {
    basisForRentAndPensionContributions: helpers.round(monthlyResults.map(result => result.basisForRentAndPensionContributions)
      .reduce((current, sum) => current + sum, 0), 2),
    basisForTax: monthlyResults.map(result => result.basisForTax)
      .reduce((current, sum) => current + sum, 0),
    contributionTotal: helpers.round(monthlyResults.map(result => result.contributionTotal)
      .reduce((current, sum) => current + sum, 0), 2),
    disabilityContribution: helpers.round(monthlyResults.map(result => result.disabilityContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    expenses: helpers.round(monthlyResults.map(result => result.expenses)
      .reduce((current, sum) => current + sum, 0), 2),
    grossAmount: helpers.round(monthlyResults.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    healthContribution: helpers.round(monthlyResults.map(result => result.healthContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    netAmount: helpers.round(monthlyResults.map(result => result.netAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    pensionContribution: helpers.round(monthlyResults.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    ppkContribution: helpers.round(monthlyResults.map(result => result.ppkContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    sickContribution: helpers.round(monthlyResults.map(result => result.sickContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    taxAmount: monthlyResults.map(result => result.taxAmount)
      .reduce((current, sum) => current + sum, 0),
  }
}
