import {EntrepreneurResult} from 'src/logic/interfaces/EntrepreneurResult'

export type AnnualResult = Omit<EntrepreneurResult, 'deductibleExpenses' | 'healthContributionBasis'>

export interface AnnualEntrepreneurResult{
  monthlyResults: EntrepreneurResult[],
  annualResult: AnnualResult,
}
