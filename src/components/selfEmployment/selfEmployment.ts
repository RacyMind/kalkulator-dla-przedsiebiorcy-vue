import {AvailableYear} from 'src/types/AvailableYear'
import {IncomeTaxType} from 'src/types/IncomeTaxType'
import {SelfEmploymentInputFields} from 'components/selfEmployment/interfaces/SelfEmploymentInputFields'
import {SelfEmploymentSingleResult} from 'components/selfEmployment/interfaces/SelfEmploymentSingleResult'
import {SelfEmploymentYearlyResult} from 'components/selfEmployment/interfaces/SelfEmploymentYearlyResult'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import ownerContributions from 'src/logic/ownerContributions'
import taxes from 'src/logic/taxes'

let params = {
  bigBasisForZUS: constants.PARAMS[helpers.getDefaultYear()].ZUS.OWNER.BIG_AMOUNT,
  freeAmountOfTax: constants.PARAMS[helpers.getDefaultYear()].FREE_AMOUNT_OF_TAX,
  grossAmountLimitForAid: constants.PARAMS[helpers.getDefaultYear()].GROSS_AMOUNT_LIMIT_FOR_AID,
  smallBasisForZUS: constants.PARAMS[helpers.getDefaultYear()].ZUS.OWNER.SMALL_AMOUNT,
}

let totalBasisForTax = 0
let totalGrossAmount = 0
let totalAmountOfDeductionOfHealthContributionFromTax = 0
let yearlyIncome = 0

/**
 * Resets total amounts
 */
function resetTotalAmounts () {
  totalBasisForTax = 0
  totalGrossAmount = 0
  totalAmountOfDeductionOfHealthContributionFromTax = 0
}

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    bigBasisForZUS: constants.PARAMS[year].ZUS.OWNER.BIG_AMOUNT,
    freeAmountOfTax: constants.PARAMS[year].FREE_AMOUNT_OF_TAX,
    grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
    smallBasisForZUS: constants.PARAMS[year].ZUS.OWNER.SMALL_AMOUNT,
  }

  resetTotalAmounts()

  taxes.setParams(year)
  ownerContributions.setParams(year)
}

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmountMinusEmployeeContributions
 * @param {number} expenses
 * @param {string} incomeTaxType
 * @returns {number}
 */
function calculateBasisForTax (grossAmountMinusEmployeeContributions:number, expenses:number, incomeTaxType:IncomeTaxType):number {
  let basisForTax = 0

  switch (incomeTaxType) {
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

  if (basisForTax < 0) {
    return 0
  }

  return helpers.round(basisForTax)
}

/**
 * Calculates the tax amount
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @param {number} basisForTax
 * @param {string} incomeTaxType
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @param {number} lumpSumTaxRate
 * @param {boolean} isFreeAmount
 * @returns {number}
 */
function calculateTaxAmount (
  grossAmount:number,
  expenses:number,
  basisForTax:number,
  incomeTaxType:IncomeTaxType,
  amountOfDeductionOfHealthContributionFromTax:number,
  lumpSumTaxRate:number,
  isFreeAmount:boolean,
  year:AvailableYear,
  ):number {
  // Since 2022 the health contribution reduces  the income instead of the tax amount
  if(year >= 2022 && [constants.TAX_TYPES.LINEAR, constants.TAX_TYPES.LUMP_SUM].includes(incomeTaxType)) {
    basisForTax -= amountOfDeductionOfHealthContributionFromTax
    amountOfDeductionOfHealthContributionFromTax = 0
  }
  switch (incomeTaxType) {
    case constants.TAX_TYPES.GENERAL:
      return taxes.calculateIncomeTaxUsingGeneralRules(grossAmount - expenses, basisForTax, amountOfDeductionOfHealthContributionFromTax, isFreeAmount, totalBasisForTax)
    case constants.TAX_TYPES.LINEAR:
      return taxes.calculateIncomeTaxUsingLinearRules(basisForTax, amountOfDeductionOfHealthContributionFromTax)
    case constants.TAX_TYPES.LUMP_SUM:
      return taxes.calculateIncomeTaxUsingLumpSumRules(basisForTax, lumpSumTaxRate, amountOfDeductionOfHealthContributionFromTax)
  }
  return 0
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
function calculateNetAmount (
  grossAmount:number,
  taxAmount:number,
  contributions:number,
  expenses:number):number {
  return helpers.round(grossAmount - taxAmount - contributions - expenses, 2)
}

/**
 * Returns the monthly results
 *
 * @param input
 * @returns {SelfEmploymentSingleResult}
 */
function getMonthlyResult (input:SelfEmploymentInputFields):SelfEmploymentSingleResult {
  if (!input.incomeTaxType) {
    return {
      accidentContribution: 0,
      amountOfDeductionOfHealthContributionFromTax: 0,
      basisForTax: 0,
      contributionTotal: 0,
      disabilityContribution: 0,
      expenses: 0,
      fpContribution: 0,
      grossAmount: 0,
      healthContribution: 0,
      netAmount: 0,
      pensionContribution: 0,
      sickContribution: 0,
      taxAmount: 0,
    }
  }

  let basisForZus = 0
  let pensionContribution = 0
  let disabilityContribution = 0
  let accidentContribution = 0
  let fpContribution = 0
  let sickContribution = 0

  if (input.isSmallZus) {
    input.isFpContribution = false
    basisForZus = params.smallBasisForZUS
  } else {
    basisForZus = params.bigBasisForZUS
  }

  if(input.isFullTimeJob) {
    input.isFpContribution = false
    input.isSickContribution = false
    input.accidentContributionRate = 0
  }

  if (input.customBasisForZus) {
    basisForZus = input.customBasisForZus
  }

  if (!input.isFullTimeJob && !input.isReliefForCompanyStart) {
    pensionContribution = ownerContributions.calculatePensionContribution(basisForZus)
    disabilityContribution = ownerContributions.calculateDisabilityContribution(basisForZus)
    accidentContribution = ownerContributions.calculateAccidentContribution(basisForZus, input.accidentContributionRate)
  }

  if (input.isFpContribution) {
    fpContribution = ownerContributions.calculateFpContribution(basisForZus)
  }

  if (input.isSickContribution && !input.isReliefForCompanyStart) {
    sickContribution = ownerContributions.calculateSickContribution(basisForZus)
  }

  const grossAmountMinusEmployeeContributions = input.amount - (pensionContribution + disabilityContribution + sickContribution + accidentContribution)


  let amountToCalculateHealthContribution = grossAmountMinusEmployeeContributions

  if(input.year < 2022 && input.incomeTaxType != constants.TAX_TYPES.LUMP_SUM) {
    amountToCalculateHealthContribution -= fpContribution
  }

  if([constants.TAX_TYPES.LINEAR, constants.TAX_TYPES.GENERAL].includes(input.incomeTaxType)) {
    amountToCalculateHealthContribution = amountToCalculateHealthContribution - input.expenses
  }

  const healthContribution = ownerContributions.calculateHealthContribution(amountToCalculateHealthContribution, input.incomeTaxType, yearlyIncome)
  const amountOfDeductionOfHealthContributionFromTax = ownerContributions.calculateAmountOfDeductionOfHealthContributionFromTax(healthContribution, input.incomeTaxType, totalAmountOfDeductionOfHealthContributionFromTax)
  totalAmountOfDeductionOfHealthContributionFromTax += amountOfDeductionOfHealthContributionFromTax

  const newTotalGrossAmount = totalGrossAmount + input.amount
  let amountToCalculateTax = grossAmountMinusEmployeeContributions

  if(input.incomeTaxType != constants.TAX_TYPES.LUMP_SUM) {
    amountToCalculateTax -= fpContribution
  }

  if (input.isReliefForBigFamily || input.isReliefForSenior) {
    let limitFreeAmountOfTax = params.grossAmountLimitForAid

    amountToCalculateTax = 0

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
  }

  const basisForTax = calculateBasisForTax(amountToCalculateTax, input.expenses, input.incomeTaxType)
  const taxAmount = calculateTaxAmount(input.amount, input.expenses, basisForTax, input.incomeTaxType, amountOfDeductionOfHealthContributionFromTax, input.taxRateForLumpSum, input.isFreeAmount, input.year)

  const totalContributions = ownerContributions.sumContributions(pensionContribution, disabilityContribution, sickContribution, healthContribution, accidentContribution, fpContribution)
  const netAmount = calculateNetAmount(input.amount, taxAmount, totalContributions, input.expenses)

  return {
    accidentContribution: accidentContribution,
    amountOfDeductionOfHealthContributionFromTax: amountOfDeductionOfHealthContributionFromTax,
    basisForTax: basisForTax,
    contributionTotal: pensionContribution + disabilityContribution + sickContribution + accidentContribution + healthContribution + fpContribution,
    disabilityContribution: disabilityContribution,
    expenses: input.expenses,
    fpContribution: fpContribution,
    grossAmount: input.amount,
    healthContribution: healthContribution,
    netAmount: netAmount,
    pensionContribution: pensionContribution,
    sickContribution: sickContribution,
    taxAmount: taxAmount,
  }
}

/**
 * Returns the yearly results
 *
 * @param {SelfEmploymentInputFields[]} monthlyInputs
 * @returns {SelfEmploymentYearlyResult}
 */
function getYearlyResult (monthlyInputs:SelfEmploymentInputFields[]):SelfEmploymentYearlyResult {
  const results:SelfEmploymentSingleResult[] = []
  totalBasisForTax = 0
  totalGrossAmount = 0
  yearlyIncome = 0

  // calculates yearly income to calculate a health contribution for lump sum
  monthlyInputs.forEach((input, month) => {
    let pensionContribution = 0
    let rentContribution = 0
    let sickContribution = 0
    let basisForZus = 0

    const isReliefForCompanyStart = input.isReliefForCompanyStart && month <=5

    if (!input.isFullTimeJob && !isReliefForCompanyStart) {

      if (input.isSmallZus) {
        basisForZus = params.smallBasisForZUS
      } else {
        basisForZus = params.bigBasisForZUS
      }

      if (input.customBasisForZus) {
        basisForZus = input.customBasisForZus
      }

      pensionContribution = ownerContributions.calculatePensionContribution(basisForZus)
      rentContribution = ownerContributions.calculateDisabilityContribution(basisForZus)
    }

    if (input.isSickContribution && !isReliefForCompanyStart) {
      sickContribution = ownerContributions.calculateSickContribution(basisForZus)
    }

    const monthlyIncome = input.amount - pensionContribution - rentContribution - sickContribution
    yearlyIncome += monthlyIncome
  })

  monthlyInputs.forEach((input, index) => {
    // Aid can be for six months
    if (index > 5 && input.isReliefForCompanyStart) {
      input.isReliefForCompanyStart = false
      input.isSmallZus = true
    }

    const result = getMonthlyResult(input)
    results.push(result)

    totalBasisForTax += result.basisForTax
    totalGrossAmount += result.grossAmount
  })

  totalBasisForTax = 0
  totalGrossAmount = 0
  yearlyIncome = 0

  return {
    monthlyResults: results,
    yearlyResult: sumMonthlyResults(results),
  }
}

function sumMonthlyResults(monthlyResults:SelfEmploymentSingleResult[]):SelfEmploymentSingleResult {
  return {
    accidentContribution: helpers.round(monthlyResults.map(result => result.accidentContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    amountOfDeductionOfHealthContributionFromTax: helpers.round(monthlyResults.map(result => result.amountOfDeductionOfHealthContributionFromTax)
      .reduce((current, sum) => current + sum, 0), 2),
    basisForTax: monthlyResults.map(result => result.basisForTax)
      .reduce((current, sum) => current + sum, 0),
    contributionTotal: helpers.round(monthlyResults.map(result => result.contributionTotal)
      .reduce((current, sum) => current + sum, 0), 2),
    disabilityContribution: helpers.round(monthlyResults.map(result => result.disabilityContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    expenses: helpers.round(monthlyResults.map(result => result.expenses)
      .reduce((current, sum) => current + sum, 0), 2),
    fpContribution: helpers.round(monthlyResults.map(result => result.fpContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    grossAmount: helpers.round(monthlyResults.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    healthContribution: helpers.round(monthlyResults.map(result => result.healthContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    netAmount: helpers.round(monthlyResults.map(result => result.netAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    pensionContribution: helpers.round(monthlyResults.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    sickContribution: helpers.round(monthlyResults.map(result => result.sickContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    taxAmount: monthlyResults.map(result => result.taxAmount)
      .reduce((current, sum) => current + sum, 0),
  }
}

export default {
  getMonthlyResult,
  getYearlyResult,
  resetTotalAmounts,
  setParams,
}
