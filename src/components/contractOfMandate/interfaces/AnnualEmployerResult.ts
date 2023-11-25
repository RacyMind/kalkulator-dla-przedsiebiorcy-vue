import {EmployerResult} from 'components/contractOfMandate/interfaces/EmployerResult'

export interface AnnualEmployerResult{
  monthlyResults: EmployerResult[],
  annualResult: EmployerResult,
}
