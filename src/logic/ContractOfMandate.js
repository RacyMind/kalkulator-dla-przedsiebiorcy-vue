import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employeeContributions from 'src/logic/employeeContributions'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

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

  if (expenses > constants.AMOUNT_OF_TAX_THRESHOLD) {
    expenses = constants.AMOUNT_OF_TAX_THRESHOLD
  }

  return helpers.round(expenses, 2)
}

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @param {number} grossAmountMinusemployeeContributions
 * @returns {number}
 */
function calculateBasisForTax (grossAmount, expenses, grossAmountMinusemployeeContributions) {
  let basisForTax = grossAmount

  if (this.gross > constants.LUMP_SUM_UP_TO_AMOUNT) {
    basisForTax = basisForTax - expenses -
      grossAmountMinusemployeeContributions
  }

  return helpers.round(basisForTax)
}

/**
 * Calculates the ta amount
 *
 * @param {number} grossAmount
 * @param {number} basisForTax
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @returns {number}
 */
function calculateTaxAmount (grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax) {
  let taxAmount = basisForTax * taxRate

  if (grossAmount > constants.LUMP_SUM_UP_TO_AMOUNT) {
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

function getMonthlyResult (
  grossAmount,
  accidentContributionRate,
  ppkContributionRate,
  partOfWorkWithAuthorExpenses,
  isPensionContribution,
  isRentContribution,
  isSickContribution,
  isHealthContribution,
  isYoung,
  ) {
  let expenseRate = 0
  let accidentContribution = 0
  let pensionContribution = 0
  let rentContribution = 0
  let sickContribution = 0
  let healthContribution = 0
  let ppkContribution = 0
  let amountOfDeductionOfHealthContributionFromTax = 0
  let basisForTax = 0
  let taxAmount = 0
  let expenses = 0

  if (grossAmount > constants.LUMP_SUM_UP_TO_AMOUNT) {
    expenseRate = constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
  }

  if (accidentContributionRate) {
    accidentContribution = employeeContributions.calculateAccidentContribution(grossAmount, accidentContributionRate)
  }
  if (isPensionContribution) {
    pensionContribution = employeeContributions.calculateRentContribution(grossAmount)
  }
  if (isRentContribution) {
    rentContribution = employeeContributions.calculatePensionContribution(grossAmount)
  }
  if (isSickContribution) {
    sickContribution = employeeContributions.calculateSickContribution(grossAmount)
  }
  if (ppkContributionRate) {
    ppkContribution = employeeContributions.calculatePpkContribution(grossAmount, ppkContributionRate)
  }

  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(grossAmount, pensionContribution, rentContribution, sickContribution)

  if (isHealthContribution) {
    healthContribution = employeeContributions.calculateHealthContribution(grossAmount)
    amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(grossAmount, grossAmountMinusEmployeeContributions)
  }

  if (!isYoung) {
    expenses = calculateExpenses(grossAmountMinusEmployeeContributions, expenseRate, partOfWorkWithAuthorExpenses)
    basisForTax = calculateBasisForTax(grossAmount, expenses, grossAmountMinusEmployeeContributions)
    taxAmount = calculateTaxAmount(grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax)
  }

  const totalContributions = employeeContributions.sumContributions(pensionContribution, rentContribution, sickContribution, healthContribution, accidentContribution)
  const netAmount = calculateNetAmount(grossAmount, taxAmount, totalContributions, ppkContribution)

  return {
    netAmount: netAmount,
    grossAmount: grossAmount,
    accidentContribution: accidentContribution,
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
