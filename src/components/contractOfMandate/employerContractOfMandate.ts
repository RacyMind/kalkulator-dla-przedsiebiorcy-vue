import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employerContributions from 'src/logic/employerContributions'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {ContractOfMandateEmployerSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployerSingleResult'
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfMandateEmployerYearlyResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployerYearlyResult'

const year = helpers.getDefaultYear()

let params = {
  limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
}

let totalBasisForRentAndPensionContributions = 0

/**
 * Resets total amounts
 */
function resetTotalAmounts () {
  totalBasisForRentAndPensionContributions = 0
}

/**
 * Sets parameters for the year
 * @param newYear
 */

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
  }

  resetTotalAmounts()

  employerContributions.setYear(year)
}

/**
 * Calculates basisForRentAndPensionContributions
 * @param {number} grossAmount
 * @returns {number}
 */
function calculateBasisForRentAndPensionContributions (grossAmount:number) {
  const newTotalBasisForRentAndPensionContributions = grossAmount + totalBasisForRentAndPensionContributions

  // The total basis of rend and pension contributions can't cross the limit basis for ZUS
  if (totalBasisForRentAndPensionContributions > params.limitBasicAmountForZus) {
    return 0
  }
  if (newTotalBasisForRentAndPensionContributions > params.limitBasicAmountForZus) {
    return params.limitBasicAmountForZus - totalBasisForRentAndPensionContributions
  }

  return grossAmount
}

/**
 * Returns the monthly results of an employer
 *
 * @param {ContractOfMandateInputFields} input
 * @returns {ContractOfMandateEmployerSingleResult}
 */
function getMonthlyResult (input:ContractOfMandateInputFields):ContractOfMandateEmployerSingleResult {

  let pensionContribution = 0
  let disabilityContribution = 0
  let accidentContribution = 0
  let ppkContribution = 0
  let fpContribution = 0
  let fgspContribution = 0
  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(input.grossAmount)

  if (input.isPensionContribution) {
    pensionContribution = employerContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  }
  if (input.isDisabilityContribution) {
    disabilityContribution = employerContributions.calculateDisabilityContribution(basisForRentAndPensionContributions)
  }
  if (input.accidentContributionRate) {
    accidentContribution = employerContributions.calculateAccidentContribution(input.grossAmount, input.accidentContributionRate)
  }
  if (input.employerPpkContributionRate) {
    ppkContribution = employerContributions.calculatePpkContribution(input.grossAmount, input.employerPpkContributionRate)
  }


  if (input.isFpContribution) {
    fpContribution = employerContributions.calculateFpContribution(input.grossAmount)
    fgspContribution = employerContributions.calculateFgspContribution(input.grossAmount)
  }

  const totalContributions = pensionContribution + disabilityContribution + accidentContribution + ppkContribution + fpContribution + fgspContribution
  const totalAmount = helpers.round(input.grossAmount + totalContributions, 2)

  return {
    totalAmount: totalAmount,
    basisForRentAndPensionContributions: basisForRentAndPensionContributions,
    grossAmount: input.grossAmount,
    pensionContribution: pensionContribution,
    disabilityContribution: disabilityContribution,
    accidentContribution: accidentContribution,
    ppkContribution: ppkContribution,
    fpContribution: fpContribution,
    fgspContribution: fgspContribution,
    contributionTotal: helpers.round(totalContributions, 2),
  }
}

/**
 * Returns the yearly results of an employer
 *
 * @param {ContractOfMandateInputFields[]} monthlyInputs
 * @returns {ContractOfMandateEmployerYearlyResult}
 */
function getYearlyResult (monthlyInputs:ContractOfMandateInputFields[]):ContractOfMandateEmployerYearlyResult {
  const results:ContractOfMandateEmployerSingleResult[] = []
  totalBasisForRentAndPensionContributions = 0

  monthlyInputs.forEach(input => {
    const result = getMonthlyResult(input)
    results.push(result)

    totalBasisForRentAndPensionContributions += result.grossAmount
  })

  const yearlyResult = {
    totalAmount: helpers.round(results.map(result => result.totalAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    grossAmount: helpers.round(results.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    basisForRentAndPensionContributions: helpers.round(results.map(result => result.basisForRentAndPensionContributions)
      .reduce((current, sum) => current + sum, 0), 2),
    pensionContribution: helpers.round(results.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    disabilityContribution: helpers.round(results.map(result => result.disabilityContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    accidentContribution: helpers.round(results.map(result => result.accidentContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    ppkContribution: helpers.round(results.map(result => result.ppkContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    fpContribution: helpers.round(results.map(result => result.fpContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    fgspContribution: helpers.round(results.map(result => result.fgspContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    contributionTotal: helpers.round(results.map(result => result.contributionTotal)
      .reduce((current, sum) => current + sum, 0), 2),
  }

  return {
    monthlyResults: results,
    yearlyResult: yearlyResult,
  }
}

export default {
  getMonthlyResult,
  getYearlyResult,
  setParams,
  resetTotalAmounts,
}
