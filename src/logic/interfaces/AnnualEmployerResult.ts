import {EmployerResult} from 'src/logic/interfaces/EmployerResult'

export interface AnnualEmployerResult{
  monthlyResults: EmployerResult[],
  annualResult: EmployerResult,
}
