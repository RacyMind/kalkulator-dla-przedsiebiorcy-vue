import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfMandateEmployeeSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployeeSingleResult'
import {ContractOfMandateEmployeeYearlyResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployeeYearlyResult'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import constants from 'src/logic/constants'
import employeeContributions from 'src/logic/employeeContributions'
import employerContributions from 'src/logic/employerContributions'
import helpers from 'src/logic/helpers'
import taxes from 'src/logic/taxes'

let params = {
  amountOfTaxThreshold: constants.PARAMS[helpers.getDefaultYear()].AMOUNT_OF_TAX_THRESHOLD,
  grossAmountLimitForAid: constants.PARAMS[helpers.getDefaultYear()].GROSS_AMOUNT_LIMIT_FOR_AID,
  limitBasicAmountForZus: constants.PARAMS[helpers.getDefaultYear()].LIMIT_BASIC_AMOUNT_FOR_ZUS,
  lumpSumUpToAmount: constants.PARAMS[helpers.getDefaultYear()].LUMP_SUM_UP_TO_AMOUNT,
  taxRate: constants.PARAMS[helpers.getDefaultYear()].TAX_RATES.FIRST_RATE / 100,
}

let totalBasisForRentAndPensionContributions = 0
let totalBasisForTax = 0
let totalExpenses = 0
let totalGrossAmount = 0

/**
 * Resets total amounts
 */
function resetTotalAmounts () {
  totalBasisForRentAndPensionContributions = 0
  totalBasisForTax = 0
  totalExpenses = 0
  totalGrossAmount = 0
}

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
    grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
    limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
    lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
    taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
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
 * @param isFreeAmount
 * @returns {number}
 */
function calculateTaxAmount (
  grossAmount:number,
  basisForTax:number,
  amountOfDeductionOfHealthContributionFromTax:number,
  isFreeAmount:boolean,
):number {
  let taxAmount = basisForTax * params.taxRate

  if (grossAmount > params.lumpSumUpToAmount) {
    taxAmount = taxes.calculateIncomeTaxUsingGeneralRules(grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, isFreeAmount, totalBasisForTax, false)
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
 * Returns the monthly results
 *
 * @param {InputFields} input
 * @param {number} month
 * @returns {ContractOfMandateEmployeeSingleResult}
 */
function getMonthlyResult (input:InputFields, month = 0):ContractOfMandateEmployeeSingleResult {
  let expenseRate = 0
  let pensionContribution = 0
  let disabilityContribution = 0
  let sickContribution = 0
  let healthContribution = 0
  let ppkContribution = 0
  let amountOfDeductionOfHealthContributionFromTax = 0
  let employerPPkContribution = 0

  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(input.grossAmount)

  if (input.grossAmount > params.lumpSumUpToAmount) {
    expenseRate = constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
  }

  if (input.isPensionContribution) {
    pensionContribution = employeeContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  }
  if (input.isDisabilityContribution) {
    disabilityContribution = employeeContributions.calculateDisabilityContribution(basisForRentAndPensionContributions)
  }
  if (input.isSickContribution) {
    sickContribution = employeeContributions.calculateSickContribution(input.grossAmount)
  }
  if (input.employeePpkContributionRate) {
    ppkContribution = employeeContributions.calculatePpkContribution(input.grossAmount, input.employeePpkContributionRate)
  }

  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(input.grossAmount, pensionContribution, disabilityContribution, sickContribution)

  if (input.isHealthContribution) {
    healthContribution = employeeContributions.calculateHealthContribution(grossAmountMinusEmployeeContributions)
    amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(input.grossAmount, grossAmountMinusEmployeeContributions)
  }

  const expenses = calculateExpenses(grossAmountMinusEmployeeContributions, expenseRate, input.hasTaxRelief, input.partOfWorkWithAuthorExpenses)
  // Adds the employer PPK contribution to the basis for tax. The tax office cares it as income
  if (month > 0) {
    employerPPkContribution += employerContributions.calculatePpkContribution(input.grossAmount, input.employerPpkContributionRate)
  }

  const basisForTax = calculateBasisForTax(input.grossAmount, grossAmountMinusEmployeeContributions + employerPPkContribution, expenses, input.hasTaxRelief)
  const taxAmount = calculateTaxAmount(input.grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, input.isFreeAmount)
  const totalContributions = employeeContributions.sumContributions(pensionContribution, disabilityContribution, sickContribution, healthContribution)
  const netAmount = calculateNetAmount(input.grossAmount, taxAmount, totalContributions, ppkContribution)

  return {
    basisForRentAndPensionContributions: basisForRentAndPensionContributions,
    basisForTax: basisForTax,
    contributionTotal: pensionContribution + disabilityContribution + sickContribution + ppkContribution + healthContribution,
    disabilityContribution: disabilityContribution,
    expenses: expenses,
    grossAmount: input.grossAmount,
    healthContribution: healthContribution,
    netAmount: netAmount,
    pensionContribution: pensionContribution,
    ppkContribution: ppkContribution,
    sickContribution: sickContribution,
    taxAmount: taxAmount,
  }
}

/**
 * Returns the yearly results
 *
 * @param {InputFields[]} monthlyInputs
 * @returns {ContractOfMandateEmployeeYearlyResult}
 */
function getYearlyResult (monthlyInputs:InputFields[]):ContractOfMandateEmployeeYearlyResult {
  const results:ContractOfMandateEmployeeSingleResult[] = []
  totalBasisForRentAndPensionContributions = 0
  totalExpenses = 0
  totalGrossAmount = 0
  totalBasisForTax = 0

  monthlyInputs.forEach((input, index) => {
    const result = getMonthlyResult(input, index)
    results.push(result)

    totalBasisForRentAndPensionContributions += result.basisForRentAndPensionContributions
    totalExpenses += result.expenses
    totalGrossAmount += result.grossAmount
    totalBasisForTax += result.basisForTax
  })

  return {
    monthlyResults: results,
    yearlyResult: helpers.sumMonthlyResults(results),
  }
}
/**
 * Looks for a gross amount
 *
 * @param {number} min
 * @param {number} max
 * @param {number} scale
 * @param targetAmount
 * @param input
 * @returns {number}
 */
function findGrossAmountUsingNetAmount (min:number, max:number, scale:number, targetAmount:number, input:InputFields):number {
  for (let iterator = max; iterator >= min; iterator -= scale) {
    input.grossAmount = iterator
    const result = getMonthlyResult(input)
    if (Math.abs(result.netAmount - targetAmount) <= 0.0005) {
      return result.grossAmount
    }
    if (Math.abs(result.netAmount - targetAmount) <= scale) {
      return findGrossAmountUsingNetAmount(result.netAmount - scale, result.grossAmount + scale, scale / 2, targetAmount, input)
    }
  }
  return 0
}

export default {
  findGrossAmountUsingNetAmount,
  getMonthlyResult,
  getYearlyResult,
  resetTotalAmounts,
  setParams,
}
