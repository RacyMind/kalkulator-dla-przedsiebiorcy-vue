import {ContractOfMandateEmployeeSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployeeSingleResult'

export interface ContractOfMandateEmployeeYearlyResult {
  readonly monthlyResults: ContractOfMandateEmployeeSingleResult[],
  readonly yearlyResult: ContractOfMandateEmployeeSingleResult,
}
