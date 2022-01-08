import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employeeContributions from 'src/logic/employeeContributions'
import employerContributions from 'src/logic/employerContributions'
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {ContractOfMandateEmployeeResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployeeResult'

let params = {
  taxRate: constants.PARAMS[helpers.getDefaultYear()].TAX_RATES.FIRST_RATE / 100,
  amountOfTaxThreshold: constants.PARAMS[helpers.getDefaultYear()].AMOUNT_OF_TAX_THRESHOLD,
  lumpSumUpToAmount: constants.PARAMS[helpers.getDefaultYear()].LUMP_SUM_UP_TO_AMOUNT,
  limitBasicAmountForZus: constants.PARAMS[helpers.getDefaultYear()].LIMIT_BASIC_AMOUNT_FOR_ZUS,
  grossAmountLimitForAid: constants.PARAMS[helpers.getDefaultYear()].GROSS_AMOUNT_LIMIT_FOR_AID,
}

let totalBasisForRentAndPensionContributions = 0
let totalExpenses = 0
let totalGrossAmount = 0

/**
 * Resets total amounts
 */
function resetTotalAmounts () {
  totalBasisForRentAndPensionContributions = 0
  totalExpenses = 0
  totalGrossAmount = 0
}

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
    amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
    lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
    limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
    grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
  }

  resetTotalAmounts()

  employerContributions.setYear(year)
  employeeContributions.setYear(year)
}

/**
 * Calculates expenses
 *
 * @param {number} basisForExpenses
 * @param {number} expenseRate
 * @param {boolean} isReliefForYoung
 * @param {number} partOfWorkWithAuthorExpenses
 * @returns {number}
 */
function calculateExpenses (basisForExpenses:number, expenseRate:number, isReliefForYoung:boolean, partOfWorkWithAuthorExpenses = 0):number {
  let partOfWorkWithoutAuthorExpenses = 1 - partOfWorkWithAuthorExpenses

  // If the relief for young exists, don't add 50% expenses
  if (isReliefForYoung) {
    partOfWorkWithoutAuthorExpenses = 1
    partOfWorkWithAuthorExpenses = 0
  }

  let expenses = basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate

  if (partOfWorkWithAuthorExpenses) {
    expenses += basisForExpenses * partOfWorkWithAuthorExpenses * constants.CONTRACT_OF_MANDATE.AUTHOR_EXPENSES_RATE
  }

  if (expenses > params.amountOfTaxThreshold) {
    expenses = params.amountOfTaxThreshold
  }

  const newTotalExpenses = expenses + totalExpenses

  // Total expenses can't cross the tax threshold
  if (totalExpenses > params.amountOfTaxThreshold) {
    return 0
  }
  if (newTotalExpenses > params.amountOfTaxThreshold) {
    return params.amountOfTaxThreshold - totalExpenses
  }

  return helpers.round(expenses, 2)
}

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmount
 * @param {number} grossAmountMinusEmployeeContributions
 * @param {number} expenses
 * @param {boolean} isReliefForYoung
 * @returns {number}
 */
function calculateBasisForTax (grossAmount:number, grossAmountMinusEmployeeContributions:number, expenses:number, isReliefForYoung:boolean):number {
  const newTotalGrossAMount = totalGrossAmount + grossAmount

  if (isReliefForYoung && newTotalGrossAMount < params.grossAmountLimitForAid) {
    return 0
  } else if (isReliefForYoung && totalGrossAmount < params.grossAmountLimitForAid) {
    grossAmountMinusEmployeeContributions = newTotalGrossAMount - params.grossAmountLimitForAid
  }

  let basisForTax = grossAmount

  if (grossAmountMinusEmployeeContributions > params.lumpSumUpToAmount) {
    basisForTax = grossAmountMinusEmployeeContributions - expenses
  }

  if (basisForTax < 0) {
    return 0
  }

  return helpers.round(basisForTax)
}

/**
 * Calculates the tax amount
 *
 * @param {number} grossAmount
 * @param {number} basisForTax
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @returns {number}
 */
function calculateTaxAmount (grossAmount:number, basisForTax:number, amountOfDeductionOfHealthContributionFromTax:number):number {
  let taxAmount = basisForTax * params.taxRate

  if (grossAmount > params.lumpSumUpToAmount) {
    taxAmount -= amountOfDeductionOfHealthContributionFromTax
  }

  if (taxAmount < 0) {
    return 0
  }

  return helpers.round(taxAmount)
}

/**
 * Calculates the net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @param {number} employeeContributions
 * @param {number} ppkAmount
 * @returns {number}
 */
function calculateNetAmount (grossAmount:number, taxAmount:number, employeeContributions:number, ppkAmount:number):number {
  return helpers.round(grossAmount - taxAmount - ppkAmount -
    employeeContributions, 2)
}

/**
 * Calculates basisForRentAndPensionContributions
 * @param {number} grossAmount
 * @returns {number}
 */
function calculateBasisForRentAndPensionContributions (grossAmount:number):number {
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
 * Returns the monthly results of an employee
 *
 * @param {ContractOfMandateInputFields} input
 * @param {number} month
 * @returns {ContractOfMandateEmployeeResult}
 */
function getMonthlyResult (input:ContractOfMandateInputFields, month = 0):ContractOfMandateEmployeeResult {
  let expenseRate = 0
  let pensionContribution = 0
  let rentContribution = 0
  let sickContribution = 0
  let healthContribution = 0
  let ppkContribution = 0
  let amountOfDeductionOfHealthContributionFromTax = 0

  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(input.grossAmount)

  if (input.grossAmount > params.lumpSumUpToAmount) {
    expenseRate = constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
  }

  if (input.isPensionContribution) {
    pensionContribution = employeeContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  }
  if (input.isRentContribution) {
    rentContribution = employeeContributions.calculateRentContribution(basisForRentAndPensionContributions)
  }
  if (input.isSickContribution) {
    sickContribution = employeeContributions.calculateSickContribution(input.grossAmount)
  }
  if (input.employeePpkContributionRate) {
    ppkContribution = employeeContributions.calculatePpkContribution(input.grossAmount, input.employeePpkContributionRate)
  }

  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(input.grossAmount, pensionContribution, rentContribution, sickContribution)

  if (input.isHealthContribution) {
    healthContribution = employeeContributions.calculateHealthContribution(grossAmountMinusEmployeeContributions)
    amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(input.grossAmount, grossAmountMinusEmployeeContributions)
  }

  const expenses = calculateExpenses(grossAmountMinusEmployeeContributions, expenseRate, input.isReliefForYoung, input.partOfWorkWithAuthorExpenses)
  let basisForTax = calculateBasisForTax(input.grossAmount, grossAmountMinusEmployeeContributions, expenses, input.isReliefForYoung)

  // Adds the employer PPK contribution to the basis for tax. The tax office cares it as income
  if (month > 0) {
    basisForTax += employerContributions.calculatePpkContribution(input.grossAmount, input.employerPpkContributionRate)
  }

  const taxAmount = calculateTaxAmount(input.grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax)

  const totalContributions = employeeContributions.sumContributions(pensionContribution, rentContribution, sickContribution, healthContribution)
  const netAmount = calculateNetAmount(input.grossAmount, taxAmount, totalContributions, ppkContribution)

  return {
    netAmount: netAmount,
    grossAmount: input.grossAmount,
    pensionContribution: pensionContribution,
    rentContribution: rentContribution,
    sickContribution: sickContribution,
    ppkContribution: ppkContribution,
    healthContribution: healthContribution,
    expenses: expenses,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
    contributionTotal: pensionContribution + rentContribution + sickContribution + ppkContribution + healthContribution,
  }
}

/**
 * Returns the yearly results of an employee
 *
 * @param {ContractOfMandateInputFields[]} monthlyInputs
 * @returns {{totalBasisForRentAndPensionContributions: number, rows: *[]}}
 */
function getYearlyResult (monthlyInputs:ContractOfMandateInputFields[]) {
  const results:ContractOfMandateEmployeeResult[] = []
  let i = 0
  totalBasisForRentAndPensionContributions = 0
  totalExpenses = 0
  totalGrossAmount = 0

  monthlyInputs.forEach(input => {
    const result = getMonthlyResult(input, i)
    results.push(result)

    totalBasisForRentAndPensionContributions += result.grossAmount
    totalExpenses += result.expenses
    totalGrossAmount += result.grossAmount
    i++
  })

  results.push({
    netAmount: results.map(result => result.netAmount)
      .reduce((current, sum) => current + sum, 0),
    grossAmount: results.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0),
    pensionContribution: results.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0),
    rentContribution: results.map(result => result.rentContribution)
      .reduce((current, sum) => current + sum, 0),
    sickContribution: results.map(result => result.sickContribution)
      .reduce((current, sum) => current + sum, 0),
    healthContribution: results.map(result => result.healthContribution)
      .reduce((current, sum) => current + sum, 0),
    ppkContribution: results.map(result => result.ppkContribution)
      .reduce((current, sum) => current + sum, 0),
    basisForTax: results.map(result => result.basisForTax)
      .reduce((current, sum) => current + sum, 0),
    expenses: results.map(result => result.expenses)
      .reduce((current, sum) => current + sum, 0),
    taxAmount: results.map(result => result.taxAmount)
      .reduce((current, sum) => current + sum, 0),
    contributionTotal: results.map(result => result.contributionTotal)
      .reduce((current, sum) => current + sum, 0),
  })

  return {
    rows: results,
    totalBasisForRentAndPensionContributions: totalBasisForRentAndPensionContributions,
    totalGrossAmount: totalGrossAmount,
  }
}

export default {
  getMonthlyResult,
  getYearlyResult,
  setParams,
  resetTotalAmounts,
}
