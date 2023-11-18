import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandateResult} from 'components/contractOfMandate/interfaces/EmployeeContractOfMandateResult'
import {EmployeeZusContribution} from 'src/logic/EmployeeZusContribution'
import {TaxSystem} from 'src/logic/TaxSystem'
import constants from 'src/logic/constants'
import employeeContributions from 'src/logic/employeeContributions'
import helpers from 'src/logic/helpers'

export class EmployeeContractOfMandate{
  public static readonly defaultExpenseRate = 0.2
  public static readonly authorExpenseRate = 0.5
  protected readonly input:ContractOfMandateInputFields
  protected readonly zusContribution: EmployeeZusContribution
  protected sumUpBasisForContributions = 0

  constructor(input:ContractOfMandateInputFields) {
    this.input = input
    this.zusContribution = new EmployeeZusContribution()
  }

  protected getExpenses(basisForExpenses:number):number {
    let expenseRate = EmployeeContractOfMandate.defaultExpenseRate

    if(this.input.grossAmount <= TaxSystem.withoutExpensesUpTo) {
      expenseRate = 0
    }

    const partOfWorkWithoutAuthorExpenses = 1 - this.input.partOfWorkWithAuthorExpenses

    let expenses = helpers.round(basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate, 2)

    if (this.input.partOfWorkWithAuthorExpenses) {
      expenses += helpers.round(basisForExpenses * this.input.partOfWorkWithAuthorExpenses * EmployeeContractOfMandate.authorExpenseRate, 2)
    }

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

    if(isPartOfAnnualResult) {
      this.sumUpBasisForContributions += basisForContributions
    }

    return {
      expenses,
    }
  }
  public getAnnualResult() {

  }
}
