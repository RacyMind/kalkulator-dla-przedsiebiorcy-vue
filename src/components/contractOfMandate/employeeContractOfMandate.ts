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

  public getSIngleMonthResult() {
    const basisForContributions = this.zusContributions.getBasisForContributions(this.input.grossAmount, this.sumUpBasisForContributions)
    this.sumUpBasisForContributions += basisForContributions
  }
}
