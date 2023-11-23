import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandateResult} from 'components/contractOfMandate/interfaces/EmployeeContractOfMandateResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import helpers from 'src/logic/helpers'

export class EmployeeContractOfMandate{
  protected readonly input:ContractOfMandateInputFields
  protected readonly zusContribution: EmployeeZusContribution
  protected readonly incomeTax: GeneraLRule
  protected sumUpContributionBasis = 0
  protected sumUpTaxBasis = 0
  protected sumUpAuthorExpenses = 0
  protected sumUpGrossAmount = 0

  constructor(input:ContractOfMandateInputFields) {
    this.input = input
    this.zusContribution = new EmployeeZusContribution()
    this.incomeTax = new GeneraLRule()
  }

  protected getAuthorExpenses(basisForAuthorExpenses:number):number {
    if (!this.input.partOfWorkWithAuthorExpenses) {
      return 0
    }

    let realThreshold = GeneraLRule.taxThreshold

    if(this.input.hasTaxRelief) {
      // it's reduced because the sum of the tax relief and the expense limit can't be more than the the tax threshold
      realThreshold = GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit
    }

    if(this.sumUpAuthorExpenses >= realThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForAuthorExpenses * this.input.partOfWorkWithAuthorExpenses * GeneraLRule.authorExpenseRate, 2)

    if(expenses + this.sumUpAuthorExpenses > realThreshold) {
      return realThreshold - this.sumUpAuthorExpenses
    }

    return expenses
  }

  protected getExpenses(basisForExpenses:number):number {
    const expenseRate = this.input.canLumpSumTaxBe && this.input.grossAmount <= GeneraLRule.withoutExpensesUpTo ? 0 : GeneraLRule.defaultExpenseRate

    const partOfWorkWithoutAuthorExpenses = 1 - this.input.partOfWorkWithAuthorExpenses

    const expenses = helpers.round(basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate, 2)

    const authorExpenses = this.getAuthorExpenses(basisForExpenses)
    this.sumUpAuthorExpenses += authorExpenses

    return expenses + authorExpenses

  }

  /**
   *
   * @param month - 0 means January, 11 - December
   * @param isPartOfAnnualResult if isPartOfAnnualResult is true, it saves important values for next month calculations
   */
  public getMonthlyResult(month = 0, isPartOfAnnualResult = false):EmployeeContractOfMandateResult {
    let pensionContribution = 0
    let disabilityContribution = 0
    let sickContribution = 0
    let healthContribution = 0
    let ppkContribution = 0

    const contributionBasis = this.zusContribution.getContributionBasis(this.input.grossAmount, this.sumUpContributionBasis)

    if (this.input.isPensionContribution) {
      pensionContribution = this.zusContribution.gePensionContribution(contributionBasis)
    }
    if (this.input.isDisabilityContribution) {
      disabilityContribution = this.zusContribution.geDisabilityContribution(contributionBasis)
    }
    if (this.input.isSickContribution) {
      sickContribution = this.zusContribution.getSickContribution(contributionBasis)
    }
    if (this.input.employeePpkContributionRate) {
      ppkContribution = this.zusContribution.getPPKContribution(this.input.grossAmount, this.input.employeePpkContributionRate)
    }

    // these contributions reduce the basis for tax
    const socialContributions = pensionContribution + disabilityContribution + sickContribution

    if(this.input.isHealthContribution) {
      healthContribution = this.zusContribution.getHealthContribution(this.input.grossAmount - socialContributions)
    }

    const salaryAmountOverTaxReliefThreshold = this.incomeTax.getSalaryAmountOverTaxReliefLimit(this.input.grossAmount, this.sumUpGrossAmount, this.input.hasTaxRelief)
    const expenses = this.getExpenses(salaryAmountOverTaxReliefThreshold - socialContributions)
    const taxBasis =  Math.round(salaryAmountOverTaxReliefThreshold - socialContributions - expenses)

    const taxAmount = this.incomeTax.getIncomeTax(taxBasis, this.sumUpTaxBasis, this.input.partTaxReducingAmount)

    this.sumUpContributionBasis += contributionBasis
    this.sumUpTaxBasis += taxBasis
    this.sumUpGrossAmount += this.input.grossAmount

    if(!isPartOfAnnualResult) {
      this.sumUpTaxBasis = 0
      this.sumUpContributionBasis = 0
      this.sumUpAuthorExpenses = 0
      this.sumUpGrossAmount = 0
    }

    return {
      healthContribution,
      sickContribution,
      ppkContribution,
      pensionContribution,
      disabilityContribution,
      expenses,
      taxBasis,
      taxAmount,
    }
  }
}
