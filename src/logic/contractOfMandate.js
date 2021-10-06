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
 * @param {number} grossAmountMinusEmployeeContributions
 * @param {number} expenses
 * @returns {number}
 */
function calculateBasisForTax (grossAmount, grossAmountMinusEmployeeContributions, expenses) {
  let basisForTax = grossAmount

  if (grossAmountMinusEmployeeContributions > constants.LUMP_SUM_UP_TO_AMOUNT) {
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

/**
 * Returns the monthly results of an employee
 *
 * @param {number} grossAmount
 * @param {number} ppkContributionRate
 * @param {number} partOfWorkWithAuthorExpenses
 * @param {boolean} isPensionContribution
 * @param {boolean} isRentContribution
 * @param {boolean} isSickContribution
 * @param {boolean} isHealthContribution
 * @param {boolean} isYoung
 * @returns {{sickContribution: number, ppkContribution: number, netAmount: number, rentContribution: number, basisForTax: number, grossAmount, healthContribution: number, taxAmount: number, accidentContribution: number, pensionContribution: number, expenses: number}}
 */
function getMonthlyResultOfEmployee (
  grossAmount,
  ppkContributionRate,
  partOfWorkWithAuthorExpenses,
  isPensionContribution,
  isRentContribution,
  isSickContribution,
  isHealthContribution,
  isYoung,
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

  if (grossAmount > constants.LUMP_SUM_UP_TO_AMOUNT) {
    expenseRate = constants.CONTRACT_OF_MANDATE.EXPENSES_RATE
  }

  if (isPensionContribution) {
    pensionContribution = employeeContributions.calculatePensionContribution(grossAmount)
  }
  if (isRentContribution) {
    rentContribution = employeeContributions.calculateRentContribution(grossAmount)
  }
  if (isSickContribution) {
    sickContribution = employeeContributions.calculateSickContribution(grossAmount)
  }
  if (ppkContributionRate) {
    ppkContribution = employeeContributions.calculatePpkContribution(grossAmount, ppkContributionRate)
  }

  const grossAmountMinusEmployeeContributions = employeeContributions.calculateGrossAmountMinusContributions(grossAmount, pensionContribution, rentContribution, sickContribution)

  if (isHealthContribution) {
    healthContribution = employeeContributions.calculateHealthContribution(grossAmountMinusEmployeeContributions)
    amountOfDeductionOfHealthContributionFromTax = employeeContributions.calculateAmountOfDeductionOfHealthContributionFromTax(grossAmount, grossAmountMinusEmployeeContributions)
  }

  if (!isYoung) {
    expenses = calculateExpenses(grossAmountMinusEmployeeContributions, expenseRate, partOfWorkWithAuthorExpenses)
    basisForTax = calculateBasisForTax(grossAmount, grossAmountMinusEmployeeContributions, expenses)
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

export { getMonthlyResultOfEmployee }
