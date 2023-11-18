import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandateResult} from 'components/contractOfMandate/interfaces/EmployeeContractOfMandateResult'
import {EmployeeZusContribution} from 'src/logic/EmployeeZusContribution'
import {TaxSystem} from 'src/logic/TaxSystem'
import constants from 'src/logic/constants'
import employeeContributions from 'src/logic/employeeContributions'
import helpers from 'src/logic/helpers'

export class EmployeeContractOfMandate{
  protected readonly input:ContractOfMandateInputFields
  protected readonly zusContribution: EmployeeZusContribution
  protected sumUpBasisForContributions = 0
  protected sumUpAuthorExpenses = 0

  constructor(input:ContractOfMandateInputFields) {
    this.input = input
    this.zusContribution = new EmployeeZusContribution()
  }

  protected getAuthorExpenses(basisForExpenses:number):number {
    if (!this.input.partOfWorkWithAuthorExpenses) {
      return 0
    }

    if(this.sumUpAuthorExpenses >= TaxSystem.taxThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForExpenses * this.input.partOfWorkWithAuthorExpenses * TaxSystem.authorExpenseRate, 2)

    if(expenses + this.sumUpAuthorExpenses > TaxSystem.taxThreshold) {
      return TaxSystem.taxThreshold - this.sumUpAuthorExpenses
    }

    return expenses
  }

  protected getExpenses(basisForExpenses:number):number {
    const expenseRate = this.input.grossAmount <= TaxSystem.withoutExpensesUpTo ? 0 : TaxSystem.defaultExpenseRate

    const partOfWorkWithoutAuthorExpenses = 1 - this.input.partOfWorkWithAuthorExpenses

    let expenses = helpers.round(basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate, 2)

    const authorExpenses = this.getAuthorExpenses(basisForExpenses)
    expenses += authorExpenses
    this.sumUpAuthorExpenses += authorExpenses

    return expenses

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

    const socialContributions = pensionContribution + disabilityContribution + sickContribution

    if(this.input.isHealthContribution) {
      healthContribution = this.zusContribution.getHealthContribution(this.input.grossAmount - socialContributions)
    }

    const expenses = this.getExpenses(this.input.grossAmount - socialContributions)

    this.sumUpBasisForContributions += basisForContributions

    if(!isPartOfAnnualResult) {
      this.sumUpBasisForContributions = 0
      this.sumUpAuthorExpenses = 0
    }

    return {
      expenses,
    }
  }
  public getAnnualResult() {

  }
}
