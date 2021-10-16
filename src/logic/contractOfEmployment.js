import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employeeContributions from 'src/logic/employeeContributions'
import employerContributions from 'src/logic/employerContributions'

let year = helpers.getDefaultYear()

let params = {
  firstTaxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
  secondTaxRate: constants.PARAMS[year].TAX_RATES.SECOND_RATE / 100,
  freeAmountOfTax: constants.PARAMS[year].FREE_AMOUNT_OF_TAX,
  amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
  lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
  limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
}

let totalBasisForRentAndPensionContributions = 0
let totalBasisForTax = 0
let totalExpenses = 0
let totalGrossAmount = 0

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    firstTaxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
    secondTaxRate: constants.PARAMS[year].TAX_RATES.SECOND_RATE / 100,
    freeAmountOfTax: constants.PARAMS[year].FREE_AMOUNT_OF_TAX,
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
 * @param {boolean} workInLivePlace
 * @param {number} partOfWorkWithAuthorExpenses
 * @returns {number}
 */
function calculateExpenses (basisForExpenses, workInLivePlace, partOfWorkWithAuthorExpenses = 0) {
  let expenses = this.constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE

  if (workInLivePlace) {
    expenses = this.constants.CONTRACT_OF_EMPLOYMENT.EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE
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
 * @param {boolean} isFreeAmount
 * @returns {number}
 */
function calculateTaxAmount (grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, isFreeAmount) {
  let freeAmountOfTax = 0

  if (isFreeAmount) {
    freeAmountOfTax = params.freeAmountOfTax
  }
  let taxAmount = basisForTax * params.firstTaxRate - amountOfDeductionOfHealthContributionFromTax - freeAmountOfTax

  if (grossAmount > params.amountOfTaxThreshold) {
    // first rate
    taxAmount = params.amountOfTaxThreshold * params.firstTaxRate - amountOfDeductionOfHealthContributionFromTax - freeAmountOfTax
    // second rate
    taxAmount += (basisForTax - params.amountOfTaxThreshold) * params.secondTaxRate
  }

  const newTotalBasisForTax = basisForTax + totalBasisForTax

  // If the total basis for the tax tax is grater than the amount of the tax threshold, there is second tax rate
  if (totalBasisForTax > params.amountOfTaxThreshold) {
    taxAmount = basisForTax * params.secondTaxRate
  }
  if (newTotalBasisForTax > params.amountOfTaxThreshold) {
    // first rate
    taxAmount = (params.amountOfTaxThreshold - totalBasisForTax) * params.firstTaxRate - amountOfDeductionOfHealthContributionFromTax - freeAmountOfTax
    // second rate
    taxAmount += (newTotalBasisForTax - params.amountOfTaxThreshold) * params.secondTaxRate
  }

  if (taxAmount < 0) {
    taxAmount = 0
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
 * @param {boolean} workInLivePlace
 * @param {boolean} isFreeAmount
 * @param {boolean} isFpContribution
 * @param {boolean} isYoung
 * @param {number} employerPpkContributionRate
 * @param {number} month
 * @returns {{sickContribution: number, ppkContribution: number, netAmount: number, rentContribution: number, basisForTax: number, grossAmount: number, healthContribution: number, taxAmount: number, pensionContribution: number, expenses: number}}
 */
function getMonthlyResultOfEmployee (
  grossAmount,
  employeePpkContributionRate,
  partOfWorkWithAuthorExpenses,
  workInLivePlace,
  isFreeAmount,
  isFpContribution,
  isYoung,
  employerPpkContributionRate = 0,
  month = 0,
) {
  let basisForTax = 0
  let taxAmount = 0
  let expenses = 0

  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(grossAmount, totalBasisForRentAndPensionContributions)

  const pensionContribution = employeeContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  const rentContribution = employeeContributions.calculateRentContribution(basisForRentAndPensionContributions)
  const sickContribution = employeeContributions.calculateSickContribution(grossAmount)
  const ppkContribution = employeeContributions.calculatePpkContribution(grossAmount, employeePpkContributionRate)

  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(grossAmount, pensionContribution, rentContribution, sickContribution)

  const healthContribution = employeeContributions.calculateHealthContribution(grossAmountMinusEmployeeContributions)
  const amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(grossAmount, grossAmountMinusEmployeeContributions)

  // Calculates the tax amount if a person is over 26 years or the gross amount of a young person crosses the tax threshold
  if (!isYoung || totalGrossAmount + grossAmount > params.amountOfTaxThreshold) {
    expenses = calculateExpenses(grossAmountMinusEmployeeContributions, workInLivePlace, partOfWorkWithAuthorExpenses)
    basisForTax = calculateBasisForTax(grossAmount, grossAmountMinusEmployeeContributions, expenses)

    // Adds the employer PPK contribution to the basis for tax. The tax office cares it as income
    if (month > 0) {
      basisForTax += employerContributions.calculatePpkContribution(grossAmount, employerPpkContributionRate)
    }

    taxAmount = calculateTaxAmount(grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, isFreeAmount)
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
  totalBasisForTax = 0

  monthlyInputs.forEach(input => {
    const result = getMonthlyResultOfEmployee(...Object.values(input), i)
    result.month = i
    results.push(result)

    totalBasisForRentAndPensionContributions += result.grossAmount
    totalExpenses += result.expenses
    totalGrossAmount += result.grossAmount
    totalBasisForTax += result.basisForTax
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
 * @param {boolean} isFpContribution
 * @returns {{totalAmount: number, ppkContribution: number, rentContribution: number, grossAmount: number, accidentContribution: number, pensionContribution: number}}
 */
function getMonthlyResultOfEmployer (
  grossAmount,
  accidentContributionRate,
  ppkContributionRate,
  isFpContribution,
) {
  if (!grossAmount) {
    grossAmount = 0
  }

  let fpContribution = 0
  let fgspContribution = 0

  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(grossAmount, totalBasisForRentAndPensionContributions)

  const pensionContribution = employerContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  const rentContribution = employerContributions.calculateRentContribution(basisForRentAndPensionContributions)
  const accidentContribution = employerContributions.calculateAccidentContribution(grossAmount, accidentContributionRate)
  const ppkContribution = employerContributions.calculatePpkContribution(grossAmount, ppkContributionRate)

  if (isFpContribution) {
    fpContribution = employerContributions.calculateFpContribution(grossAmount)
    fgspContribution = employerContributions.calculateFgspContribution(grossAmount)
  }
  const totalAmount = grossAmount + pensionContribution + rentContribution + accidentContribution + ppkContribution + fpContribution + fgspContribution

  return {
    totalAmount: totalAmount,
    grossAmount: grossAmount,
    pensionContribution: pensionContribution,
    rentContribution: rentContribution,
    accidentContribution: accidentContribution,
    ppkContribution: ppkContribution,
    fpContribution: fpContribution,
    fgspContribution: fgspContribution,
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
    fpContribution: results.map(result => result.fpContribution)
      .reduce((current, sum) => current + sum, 0),
    fgspContribution: results.map(result => result.fgspContribution)
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
