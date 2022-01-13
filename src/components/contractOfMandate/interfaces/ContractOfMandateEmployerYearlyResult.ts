import {ContractOfMandateEmployerSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployerSingleResult'

export interface ContractOfMandateEmployerYearlyResult {
  readonly monthlyResults: ContractOfMandateEmployerSingleResult[],
  readonly yearlyResult: ContractOfMandateEmployerSingleResult,
}
