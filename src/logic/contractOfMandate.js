import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employeeContributions from 'src/logic/employeeContributions'
import employerContributions from 'src/logic/employerContributions'

let year = helpers.getDefaultYear()

let params = {
  taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
  amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
  lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
  limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
}

let totalBasisForRentAndPensionContributions = 0
let totalExpenses = 0
let totalGrossAmount = 0

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
    amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
    lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
    limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
  }

  employerContributions.setYear(newYear)
  employeeContributions.setYear(newYear)
}

/**
 * Calculates expenses
 *
 * @param {number} basisForExpenses
 * @param {number} expenseRate
 * @param {number} partOfWorkWithAuthorExpenses
 * @returns {number}
 */
function calculateExpenses (basisForExpenses, expenseRate, partOfWorkWithAuthorExpenses = 0) {
  const partOfWorkWithoutAuthorExpenses = 1 - partOfWorkWithAuthorExpenses

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
 * @returns {number}
 */
function calculateBasisForTax (grossAmount, grossAmountMinusEmployeeContributions, expenses) {
  let basisForTax = grossAmount

  if (grossAmountMinusEmployeeContributions > params.lumpSumUpToAmount) {
    basisForTax = grossAmountMinusEmployeeContributions - expenses
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
function calculateTaxAmount (grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax) {
  let taxAmount = basisForTax * params.taxRate

  if (grossAmount > params.lumpSumUpToAmount) {
    taxAmount -= amountOfDeductionOfHealthContributionFromTax
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
function calculateNetAmount (grossAmount, taxAmount, employeeContributions, ppkAmount) {
  return helpers.round(grossAmount - taxAmount - ppkAmount -
    employeeContributions, 2)
}

/**
 * Calculates basisForRentAndPensionContributions
 * @param {number} grossAmount
 * @param {number} totalBasisForRentAndPensionContributions
 * @returns {number}
 */
function calculateBasisForRentAndPensionContributions (grossAmount, totalBasisForRentAndPensionContributions) {
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
 * @param {number} grossAmount
 * @param {number} employeePpkContributionRate
 * @param {number} partOfWorkWithAuthorExpenses
 * @param {boolean} isPensionContribution
 * @param {boolean} isRentContribution
 * @param {boolean} isSickContribution
 * @param {boolean} isHealthContribution
 * @param {boolean} isYoung
 * @param {number} employerPpkContributionRate
 * @param {number} month
 * @returns {{sickContribution: number, ppkContribution: number, netAmount: number, rentContribution: number, basisForTax: number, grossAmount: ComputedRef<*>, healthContribution: number, taxAmount: number, pensionContribution: number, expenses: number}}
 */
function getMonthlyResultOfEmployee (
  grossAmount,
  employeePpkContributionRate,
  partOfWorkWithAuthorExpenses,
  isPensionContribution,
  isRentContribution,
  isSickContribution,
  isHealthContribution,
  isYoung,
  employerPpkContributionRate = 0,
  month = 0,
) {
  let expenseRate = 0
  let pensionContribution = 0
  let rentContribution = 0
  let sickContribution = 0
  let healthContribution = 0
  let ppkContribution = 0
  let amountOfDeductionOfHealthContributionFromTax = 0
  let basisForTax = 0
  let taxAmount = 0
  let expenses = 0

  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(grossAmount, totalBasisForRentAndPensionContributions)

  if (grossAmount > params.lumpSumUpToAmount) {
    expenseRate = constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
  }

  if (isPensionContribution) {
    pensionContribution = employeeContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  }
  if (isRentContribution) {
    rentContribution = employeeContributions.calculateRentContribution(basisForRentAndPensionContributions)
  }
  if (isSickContribution) {
    sickContribution = employeeContributions.calculateSickContribution(grossAmount)
  }
  if (employeePpkContributionRate) {
    ppkContribution = employeeContributions.calculatePpkContribution(grossAmount, employeePpkContributionRate)
  }

  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(grossAmount, pensionContribution, rentContribution, sickContribution)

  if (isHealthContribution) {
    healthContribution = employeeContributions.calculateHealthContribution(grossAmountMinusEmployeeContributions)
    amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(grossAmount, grossAmountMinusEmployeeContributions)
  }

  // Calculates the tax amount if a person is over 26 years or the gross amount of a young person crosses the tax threshold
  if (!isYoung || totalGrossAmount + grossAmount > params.amountOfTaxThreshold) {
    expenses = calculateExpenses(grossAmountMinusEmployeeContributions, expenseRate, partOfWorkWithAuthorExpenses)
    basisForTax = calculateBasisForTax(grossAmount, grossAmountMinusEmployeeContributions, expenses)

    // Adds the employer PPK contribution to the basis for tax. The tax office cares it as income
    if (month > 0) {
      basisForTax += employerContributions.calculatePpkContribution(grossAmount, employerPpkContributionRate)
    }

    taxAmount = calculateTaxAmount(grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax)
  }

  const totalContributions = employeeContributions.sumContributions(pensionContribution, rentContribution, sickContribution, healthContribution)
  const netAmount = calculateNetAmount(grossAmount, taxAmount, totalContributions, ppkContribution)

  return {
    netAmount: netAmount,
    grossAmount: grossAmount,
    pensionContribution: pensionContribution,
    rentContribution: rentContribution,
    sickContribution: sickContribution,
    ppkContribution: ppkContribution,
    healthContribution: healthContribution,
    expenses: expenses,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
  }
}

/**
 * Returns the yearly results of an employee
 *
 * @param {[]} monthlyInputs
 * @returns {{totalBasisForRentAndPensionContributions: number, rows: *[]}}
 */
function getYearlyResultOfEmployee (monthlyInputs) {
  const results = []
  let i = 0
  totalBasisForRentAndPensionContributions = 0
  totalExpenses = 0
  totalGrossAmount = 0

  monthlyInputs.forEach(input => {
    const result = getMonthlyResultOfEmployee(...Object.values(input), i)
    result.month = i
    results.push(result)

    totalBasisForRentAndPensionContributions += result.grossAmount
    totalExpenses += result.expenses
    totalGrossAmount += result.grossAmount
    i++
  })

  results.push({
    month: constants.LOCALE_DATE.wholeYearIndex,
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
    taxAmount: results.map(result => result.taxAmount)
      .reduce((current, sum) => current + sum, 0),
  })

  return {
    rows: results,
    totalBasisForRentAndPensionContributions: totalBasisForRentAndPensionContributions,
    totalGrossAmount: totalGrossAmount,
  }
}

/**
 * Returns the monthly results of an employer
 *
 * @param {number} grossAmount
 * @param {number} accidentContributionRate
 * @param {number} ppkContributionRate
 * @param {boolean} isPensionContribution
 * @param {boolean} isRentContribution
 * @returns {{totalAmount: number, ppkContribution: number, rentContribution: number, grossAmount: number, accidentContribution: number, pensionContribution: number}}
 */
function getMonthlyResultOfEmployer (
  grossAmount,
  accidentContributionRate,
  ppkContributionRate,
  isPensionContribution,
  isRentContribution,
) {
  if (!grossAmount) {
    grossAmount = 0
  }

  let pensionContribution = 0
  let rentContribution = 0
  let accidentContribution = 0
  let ppkContribution = 0
  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(grossAmount, totalBasisForRentAndPensionContributions)

  if (isPensionContribution) {
    pensionContribution = employerContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  }
  if (isRentContribution) {
    rentContribution = employerContributions.calculateRentContribution(basisForRentAndPensionContributions)
  }
  if (accidentContributionRate) {
    accidentContribution = employerContributions.calculateAccidentContribution(grossAmount, accidentContributionRate)
  }
  if (ppkContributionRate) {
    ppkContribution = employerContributions.calculatePpkContribution(grossAmount, ppkContributionRate)
  }

  const totalAmount = grossAmount + pensionContribution + rentContribution + accidentContribution + ppkContribution

  return {
    totalAmount: totalAmount,
    grossAmount: grossAmount,
    pensionContribution: pensionContribution,
    rentContribution: rentContribution,
    accidentContribution: accidentContribution,
    ppkContribution: ppkContribution,
  }
}

/**
 * Returns the yearly results of an employer
 *
 * @param {[]} monthlyInputs
 * @returns {{totalBasisForRentAndPensionContributions: number, rows: *[]}}
 */
function getYearlyResultOfEmployer (monthlyInputs) {
  const results = []
  let i = 0
  totalBasisForRentAndPensionContributions = 0

  monthlyInputs.forEach(input => {
    const result = getMonthlyResultOfEmployer(...Object.values(input))
    result.month = i
    results.push(result)

    totalBasisForRentAndPensionContributions += result.grossAmount
    i++
  })

  results.push({
    month: constants.LOCALE_DATE.wholeYearIndex,
    totalAmount: results.map(result => result.totalAmount)
      .reduce((current, sum) => current + sum, 0),
    grossAmount: results.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0),
    pensionContribution: results.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0),
    rentContribution: results.map(result => result.rentContribution)
      .reduce((current, sum) => current + sum, 0),
    accidentContribution: results.map(result => result.accidentContribution)
      .reduce((current, sum) => current + sum, 0),
    ppkContribution: results.map(result => result.ppkContribution)
      .reduce((current, sum) => current + sum, 0),
  })

  return {
    rows: results,
    totalBasisForRentAndPensionContributions: totalBasisForRentAndPensionContributions,
  }
}

export default {
  getMonthlyResultOfEmployee,
  getMonthlyResultOfEmployer,
  getYearlyResultOfEmployer,
  getYearlyResultOfEmployee,
  setYear,
}
