import {ContractOfEmploymentEmployerSingleResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployerSingleResult'

export interface ContractOfEmploymentEmployerYearlyResult {
  readonly monthlyResults: ContractOfEmploymentEmployerSingleResult[],
  readonly yearlyResult: ContractOfEmploymentEmployerSingleResult,
}
