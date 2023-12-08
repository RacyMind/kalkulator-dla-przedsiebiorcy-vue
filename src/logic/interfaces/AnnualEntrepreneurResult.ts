import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'

export interface AnnualEntrepreneurResult{
  monthlyResults: EntrepreneurResult[],
  annualResult: EntrepreneurResult,
}
