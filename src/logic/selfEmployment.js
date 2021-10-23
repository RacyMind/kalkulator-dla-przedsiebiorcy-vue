import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import ownerContributions from './ownerContributions'
import taxes from './taxes'

let year = helpers.getDefaultYear()

let params = {
  smallBasisForZUS: constants.PARAMS[year].ZUS.OWNER.SMALL_AMOUNT,
  bigBasisForZUS: constants.PARAMS[year].ZUS.OWNER.BIG_AMOUNT,
  grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
  freeAmountOfTax: constants.PARAMS[year].FREE_AMOUNT_OF_TAX,
}

let totalBasisForTax = 0
let totalGrossAmount = 0

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    smallBasisForZUS: constants.PARAMS[year].ZUS.OWNER.SMALL_AMOUNT,
    bigBasisForZUS: constants.PARAMS[year].ZUS.OWNER.BIG_AMOUNT,
    grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
    freeAmountOfTax: constants.PARAMS[year].FREE_AMOUNT_OF_TAX,
  }

  resetTotalAmounts()

  taxes.setYear(newYear)
  ownerContributions.setYear(newYear)
}

/**
 * Resets total amounts
 */
function resetTotalAmounts () {
  totalBasisForTax = 0
  totalGrossAmount = 0
}

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmountMinusEmployeeContributions
 * @param {number} expenses
 * @param {string} taxType
 * @returns {number}
 */
function calculateBasisForTax (grossAmountMinusEmployeeContributions, expenses, taxType) {
  let basisForTax = 0

  switch (taxType) {
    case constants.TAX_TYPES.LINEAR:
      basisForTax = grossAmountMinusEmployeeContributions - expenses
      break
    case constants.TAX_TYPES.GENERAL:
      basisForTax = grossAmountMinusEmployeeContributions - expenses
      break
    case constants.TAX_TYPES.LUMP_SUM:
      basisForTax = grossAmountMinusEmployeeContributions
      break
  }

  return helpers.round(basisForTax)
}

/**
 * Calculates the tax amount
 *
 * @param {number} grossAmount
 * @param {number} basisForTax
 * @param {string} taxType
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @param {number} lumpSumTaxRate
 * @param {boolean} isFreeAmount
 * @param {boolean} isAidForMiddleClass
 * @returns {number}
 */
function calculateTaxAmount (grossAmount, basisForTax, taxType, amountOfDeductionOfHealthContributionFromTax, lumpSumTaxRate, isFreeAmount, isAidForMiddleClass) {
  switch (taxType) {
    case constants.TAX_TYPES.GENERAL:
      return taxes.calculateIncomeTaxUsingGeneralRules(grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, isFreeAmount, totalBasisForTax, isAidForMiddleClass)
    case constants.TAX_TYPES.LINEAR:
      return taxes.calculateIncomeTaxUsingLinearRules(basisForTax, amountOfDeductionOfHealthContributionFromTax)
    case constants.TAX_TYPES.LUMP_SUM:
      return taxes.calculateIncomeTaxUsingLumpSumRules(basisForTax, lumpSumTaxRate, amountOfDeductionOfHealthContributionFromTax)
  }
}

/**
 * Calculates the net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @param {number} contributions
 * @param {number} expenses
 * @returns {number}
 */
function calculateNetAmount (grossAmount, taxAmount, contributions, expenses) {
  return helpers.round(grossAmount - taxAmount - contributions - expenses, 2)
}

/**
 * Returns the monthly results
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @param {string} taxType
 * @param {number} taxRateForLumpSum
 * @param {boolean} isFreeAmount
 * @param {number} accidentContributionRate
 * @param {boolean} isFpContribution
 * @param {boolean} isSickContribution
 * @param {boolean} isSmallZus
 * @param {boolean} isAidForStart
 * @param {boolean} isFullTimeJob
 * @param {number} customBasisForZus
 * @param {boolean} isAidForBigFamily
 * @param {boolean} isAidForSenior
 * @param {boolean} isAidForMiddleClass
 * @returns {{sickContribution: number, netAmount: number, rentContribution: number, fpContribution: number, basisForTax: number, grossAmount: number, healthContribution: number, taxAmount: number, accidentContribution: number, pensionContribution: number, expenses: number}}
 */
function getMonthlyResult (
  grossAmount,
  expenses,
  taxType,
  taxRateForLumpSum,
  isFreeAmount,
  accidentContributionRate,
  isFpContribution,
  isSickContribution,
  isSmallZus,
  isAidForStart,
  isFullTimeJob,
  customBasisForZus,
  isAidForBigFamily = false,
  isAidForSenior = false,
  isAidForMiddleClass = false,
) {
  if (!taxType) {
    return {
      netAmount: 0,
      grossAmount: 0,
      pensionContribution: 0,
      rentContribution: 0,
      sickContribution: 0,
      accidentContribution: 0,
      fpContribution: 0,
      healthContribution: 0,
      expenses: 0,
      basisForTax: 0,
      taxAmount: 0,
    }
  }

  let basisForZus = 0
  let pensionContribution = 0
  let rentContribution = 0
  let accidentContribution = 0
  let fpContribution = 0
  let sickContribution = 0

  if (isSmallZus) {
    basisForZus = params.smallBasisForZUS
  } else {
    basisForZus = params.bigBasisForZUS
  }

  if (customBasisForZus) {
    basisForZus = customBasisForZus
  }

  const healthContribution = ownerContributions.calculateHealthContribution(grossAmount - expenses, taxType, totalGrossAmount + grossAmount)

  if (!isFullTimeJob && !isAidForStart) {
    pensionContribution = ownerContributions.calculatePensionContribution(basisForZus)
    rentContribution = ownerContributions.calculateRentContribution(basisForZus)
    accidentContribution = ownerContributions.calculateAccidentContribution(basisForZus, accidentContributionRate)
  }

  if (isFpContribution) {
    fpContribution = ownerContributions.calculateFpContribution(basisForZus)
  }

  if (isSickContribution && !isAidForStart) {
    sickContribution = ownerContributions.calculateSickContribution(basisForZus)
  }

  const grossAmountMinusEmployeeContributions = ownerContributions.calculateGrossAmountMinusContributions(grossAmount, pensionContribution, rentContribution, sickContribution, accidentContribution)
  const amountOfDeductionOfHealthContributionFromTax = ownerContributions.calculateAmountOfDeductionOfHealthContributionFromTax()

  const newTotalGrossAmount = totalGrossAmount + grossAmount
  let amountToCalculateTax = grossAmountMinusEmployeeContributions

  if (isAidForBigFamily || isAidForSenior) {
    let limitFreeAmountOfTax = params.grossAmountLimitForAid

    amountToCalculateTax = 0

    if (isFreeAmount) {
      limitFreeAmountOfTax += params.freeAmountOfTax
    }

    if (newTotalGrossAmount > limitFreeAmountOfTax) {
      amountToCalculateTax = newTotalGrossAmount - limitFreeAmountOfTax
    }
    if (totalGrossAmount > limitFreeAmountOfTax) {
      amountToCalculateTax = grossAmountMinusEmployeeContributions
    }
    isFreeAmount = false
  }

  const basisForTax = calculateBasisForTax(amountToCalculateTax, expenses, taxType)
  const taxAmount = calculateTaxAmount(grossAmount, basisForTax, taxType, amountOfDeductionOfHealthContributionFromTax, taxRateForLumpSum, isFreeAmount, isAidForMiddleClass)

  const totalContributions = ownerContributions.sumContributions(pensionContribution, rentContribution, sickContribution, healthContribution, accidentContribution, fpContribution)
  const netAmount = calculateNetAmount(grossAmount, taxAmount, totalContributions, expenses)

  return {
    netAmount: netAmount,
    grossAmount: grossAmount,
    pensionContribution: pensionContribution,
    rentContribution: rentContribution,
    sickContribution: sickContribution,
    accidentContribution: accidentContribution,
    fpContribution: fpContribution,
    healthContribution: healthContribution,
    expenses: expenses,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
  }
}

/**
 * Returns the yearly results
 *
 * @param {[]} monthlyInputs
 * @returns {{totalBasisForTax: number, rows: *[]}}
 */
function getYearlyResult (monthlyInputs) {
  const results = []
  let i = 0
  totalBasisForTax = 0
  totalGrossAmount = 0

  monthlyInputs.forEach(input => {
    // Aid can be for six months
    if (i > 5 && input.isAidForStart) {
      input.isAidForStart = false
      input.isSmallZus = true
    }

    const result = getMonthlyResult(...Object.values(input), i)
    result.month = i
    results.push(result)

    totalBasisForTax += result.basisForTax
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
    accidentContribution: results.map(result => result.accidentContribution)
      .reduce((current, sum) => current + sum, 0),
    fpContribution: results.map(result => result.fpContribution)
      .reduce((current, sum) => current + sum, 0),
    taxAmount: results.map(result => result.taxAmount)
      .reduce((current, sum) => current + sum, 0),
    expenses: results.map(result => result.expenses)
      .reduce((current, sum) => current + sum, 0),
  })

  return {
    rows: results,
    totalBasisForTax: totalBasisForTax,
  }
}

export default {
  getMonthlyResult,
  getYearlyResult,
  setYear,
  resetTotalAmounts,
}
