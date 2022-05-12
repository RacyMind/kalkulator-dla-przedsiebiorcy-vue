import {ContractOfEmploymentEmployeeSingleResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeSingleResult'

export interface ContractOfEmploymentEmployeeYearlyResult {
  readonly monthlyResults: ContractOfEmploymentEmployeeSingleResult[],
  readonly yearlyResult: ContractOfEmploymentEmployeeSingleResult,
}
