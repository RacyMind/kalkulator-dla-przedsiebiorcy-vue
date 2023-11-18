import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeZusContribution} from 'src/logic/EmployeeZusContribution'

export class EmployeeContractOfMandate{
  public static readonly expenseRate = 0.2
  protected readonly input:ContractOfMandateInputFields
  protected readonly zusContributions: EmployeeZusContribution
  protected sumUpBasisForContributions = 0

  constructor(input:ContractOfMandateInputFields) {
    this.input = input
    this.zusContributions = new EmployeeZusContribution()
  }

  /**
   *
   * @param month - 0 means January, 11 - December
   * @param isPartOfAnnualResult if isPartOfAnnualResult is true, it saves important values for next month calculations
   */
  public getMonthlyResult(month = 0, isPartOfAnnualResult = false) {
    const basisForContributions = this.zusContributions.getBasisForContributions(this.input.grossAmount, this.sumUpBasisForContributions)

    if(isPartOfAnnualResult) {
      this.sumUpBasisForContributions += basisForContributions
    }
  }
  public getAnnualResult() {

  }
}
