import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employeeContributions from 'src/logic/employeeContributions'
import employerContributions from 'src/logic/employerContributions'
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import {ContractOfEmploymentEmployeeSingleResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeSingleResult'
import {ContractOfEmploymentEmployeeYearlyResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeYearlyResult'
import taxes from 'src/logic/taxes'

let params = {
  firstTaxRate: constants.PARAMS[helpers.getDefaultYear()].TAX_RATES.FIRST_RATE / 100,
  secondTaxRate: constants.PARAMS[helpers.getDefaultYear()].TAX_RATES.SECOND_RATE / 100,
  freeAmountOfTax: constants.PARAMS[helpers.getDefaultYear()].FREE_AMOUNT_OF_TAX,
  taxReducingAmount: constants.PARAMS[helpers.getDefaultYear()].TAX_REDUCING_AMOUNT,
  amountOfTaxThreshold: constants.PARAMS[helpers.getDefaultYear()].AMOUNT_OF_TAX_THRESHOLD,
  grossAmountLimitForAid: constants.PARAMS[helpers.getDefaultYear()].GROSS_AMOUNT_LIMIT_FOR_AID,
  limitBasicAmountForZus: constants.PARAMS[helpers.getDefaultYear()].LIMIT_BASIC_AMOUNT_FOR_ZUS,
  expensesIfYouWorkWhereYouDontLive: constants.PARAMS[helpers.getDefaultYear()].EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE,
  expensesIfYouWorkWhereYouLive: constants.PARAMS[helpers.getDefaultYear()].EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE,
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
    firstTaxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
    secondTaxRate: constants.PARAMS[year].TAX_RATES.SECOND_RATE / 100,
    freeAmountOfTax: constants.PARAMS[year].FREE_AMOUNT_OF_TAX,
    taxReducingAmount: constants.PARAMS[year].TAX_REDUCING_AMOUNT,
    amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
    grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
    limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
    expensesIfYouWorkWhereYouDontLive: constants.PARAMS[year].EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE,
    expensesIfYouWorkWhereYouLive: constants.PARAMS[year].EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE,
  }

  resetTotalAmounts()

  employerContributions.setYear(year)
  employeeContributions.setYear(year)
}

/**
 * Calculates expenses
 *
 * @param {number} basisForExpenses
 * @param {boolean} workInLivePlace
 * @param {boolean} isReliefForYoung
 * @param {number} partOfWorkWithAuthorExpenses
 * @returns {number}
 */
function calculateExpenses (basisForExpenses:number, workInLivePlace:boolean, isReliefForYoung:boolean, partOfWorkWithAuthorExpenses = 0) {
  let expenses = params.expensesIfYouWorkWhereYouDontLive

  if (workInLivePlace) {
    expenses = params.expensesIfYouWorkWhereYouLive
  }

  // If the aid for young exists, don't add 50% expenses
  if (isReliefForYoung) {
    partOfWorkWithAuthorExpenses = 0
  }

  if (partOfWorkWithAuthorExpenses) {
    expenses += basisForExpenses * partOfWorkWithAuthorExpenses * constants.CONTRACT_OF_EMPLOYMENT.AUTHOR_EXPENSES_RATE
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

  const basisForTax = grossAmountMinusEmployeeContributions - expenses

  if (basisForTax < 0) {
    return 0
  }

  return helpers.round(basisForTax)
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
 * @param {ContractOfEmploymentInputFields} input
 * @param {number} month
 * @returns {ContractOfEmploymentEmployeeSingleResult}
 */
function getMonthlyResult (input:ContractOfEmploymentInputFields, month = 0):ContractOfEmploymentEmployeeSingleResult {
  let basisForTax = 0
  let taxAmount = 0
  let expenses = 0

  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(input.grossAmount)
  const pensionContribution = employeeContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  const disabilityContribution = employeeContributions.calculateDisabilityContribution(basisForRentAndPensionContributions)
  const sickContribution = employeeContributions.calculateSickContribution(input.grossAmount)
  const ppkContribution = employeeContributions.calculatePpkContribution(input.grossAmount, input.employeePpkContributionRate)
  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(input.grossAmount, pensionContribution, disabilityContribution, sickContribution)
  const healthContribution = employeeContributions.calculateHealthContribution(grossAmountMinusEmployeeContributions)
  const amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(input.grossAmount, grossAmountMinusEmployeeContributions)
  const newTotalGrossAmount = totalGrossAmount + input.grossAmount

  let amountToCalculateTax = 0

  if (input.isReliefForBigFamily || input.isReliefForSenior) {
    let limitFreeAmountOfTax = params.grossAmountLimitForAid

    if (input.isFreeAmount) {
      limitFreeAmountOfTax += params.freeAmountOfTax
    }

    if (newTotalGrossAmount > limitFreeAmountOfTax) {
      amountToCalculateTax = newTotalGrossAmount - limitFreeAmountOfTax
    }
    if (totalGrossAmount > limitFreeAmountOfTax) {
      amountToCalculateTax = grossAmountMinusEmployeeContributions
    }
    input.isFreeAmount = false
  } else {
    amountToCalculateTax = grossAmountMinusEmployeeContributions
  }

  if (amountToCalculateTax > 0) {
    expenses = calculateExpenses(amountToCalculateTax, input.workInLivePlace, input.isReliefForYoung, input.partOfWorkWithAuthorExpenses)
    basisForTax = calculateBasisForTax(input.grossAmount, amountToCalculateTax, expenses, input.isReliefForYoung)
  }

  // Adds the employer PPK contribution to the basis for tax. The tax office cares it as income
  if (month > 0) {
    basisForTax += employerContributions.calculatePpkContribution(input.grossAmount, input.employerPpkContributionRate)
  }

  if (amountToCalculateTax > 0) {
    taxAmount = taxes.calculateIncomeTaxUsingGeneralRules(input.grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, input.isFreeAmount, totalBasisForTax)
  }

  const totalContributions = employeeContributions.sumContributions(pensionContribution, disabilityContribution, sickContribution, healthContribution)
  const netAmount = calculateNetAmount(input.grossAmount, taxAmount, totalContributions, ppkContribution)

  return {
    netAmount: netAmount,
    grossAmount: input.grossAmount,
    basisForRentAndPensionContributions: basisForRentAndPensionContributions,
    pensionContribution: pensionContribution,
    disabilityContribution: disabilityContribution,
    sickContribution: sickContribution,
    ppkContribution: ppkContribution,
    healthContribution: healthContribution,
    expenses: expenses,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
    contributionTotal: pensionContribution + disabilityContribution + sickContribution + ppkContribution + healthContribution,
  }
}

/**
 * Returns the yearly results of an employee
 *
 * @param {ContractOfEmploymentInputFields[]} monthlyInputs
 * @returns {ContractOfEmploymentEmployeeYearlyResult}
 */
function getYearlyResult (monthlyInputs:ContractOfEmploymentInputFields[]):ContractOfEmploymentEmployeeYearlyResult {
  const results:ContractOfEmploymentEmployeeSingleResult[] = []
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
function findGrossAmountUsingNetAmount (min:number, max:number, scale:number, targetAmount:number, input:ContractOfEmploymentInputFields):number {
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
  getMonthlyResult,
  getYearlyResult,
  setParams,
  resetTotalAmounts,
  findGrossAmountUsingNetAmount,
}
