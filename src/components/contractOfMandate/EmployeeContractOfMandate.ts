import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandateResult} from 'components/contractOfMandate/interfaces/EmployeeContractOfMandateResult'
import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import {TaxSystem} from 'src/logic/TaxSystem'
import helpers from 'src/logic/helpers'

export class EmployeeContractOfMandate{
  protected readonly input:ContractOfMandateInputFields
  protected readonly zusContribution: EmployeeZusContribution
  protected sumUpBasisForContributions = 0
  protected sumUpAuthorExpenses = 0
  protected sumUpGrossAmount = 0

  constructor(input:ContractOfMandateInputFields) {
    this.input = input
    this.zusContribution = new EmployeeZusContribution()
  }

  /**
   * Returns the salary amount over the aid threshold. This amount is important for tax calculations
   */
  protected getImportantSalaryAmountForTax(): number{
    if(!this.input.hasAidForYoung) {
      return this.input.grossAmount
    }

    if(this.sumUpGrossAmount > TaxSystem.aidThreshold) {
      return this.input.grossAmount
    }
    if(this.sumUpGrossAmount + this.input.grossAmount > TaxSystem.aidThreshold) {
      return this.sumUpGrossAmount + this.input.grossAmount -  TaxSystem.aidThreshold
    }

    return 0
  }

  protected getAuthorExpenses(basisForAuthorExpenses:number):number {
    if (!this.input.partOfWorkWithAuthorExpenses) {
      return 0
    }

    let realThreshold = TaxSystem.taxThreshold

    if(this.input.hasAidForYoung) {
      // it's reduced because the sum of the aid and the expense limit can't be more than the the tax threshold
      realThreshold = TaxSystem.taxThreshold - TaxSystem.aidThreshold
    }

    if(this.sumUpAuthorExpenses >= realThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForAuthorExpenses * this.input.partOfWorkWithAuthorExpenses * TaxSystem.authorExpenseRate, 2)

    if(expenses + this.sumUpAuthorExpenses > realThreshold) {
      return realThreshold - this.sumUpAuthorExpenses
    }

    return expenses
  }

  protected getExpenses(basisForExpenses:number):number {
    const expenseRate = this.input.canLumpSumTaxBe && this.input.grossAmount <= TaxSystem.withoutExpensesUpTo ? 0 : TaxSystem.defaultExpenseRate

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

    const basisForContributions = this.zusContribution.getBasisForContributions(this.input.grossAmount, this.sumUpBasisForContributions)

    if (this.input.isPensionContribution) {
      pensionContribution = this.zusContribution.gePensionContribution(basisForContributions)
    }
    if (this.input.isDisabilityContribution) {
      disabilityContribution = this.zusContribution.geDisabilityContribution(basisForContributions)
    }
    if (this.input.isSickContribution) {
      sickContribution = this.zusContribution.getSickContribution(basisForContributions)
    }
    if (this.input.employeePpkContributionRate) {
      ppkContribution = this.zusContribution.getPPKContribution(this.input.grossAmount, this.input.employeePpkContributionRate)
    }

    // these contributions reduce the basis for tax
    const socialContributions = pensionContribution + disabilityContribution + sickContribution

    if(this.input.isHealthContribution) {
      healthContribution = this.zusContribution.getHealthContribution(this.input.grossAmount - socialContributions)
    }

    const importantSalaryAmountForTax = this.getImportantSalaryAmountForTax()
    const expenses = this.getExpenses(importantSalaryAmountForTax - socialContributions)
    const basisForTax =  Math.round(importantSalaryAmountForTax - socialContributions - expenses)

    this.sumUpBasisForContributions += basisForContributions
    this.sumUpGrossAmount += this.input.grossAmount

    if(!isPartOfAnnualResult) {
      this.sumUpBasisForContributions = 0
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
      basisForTax,
    }
  }
  public getAnnualResult() {

  }
}
