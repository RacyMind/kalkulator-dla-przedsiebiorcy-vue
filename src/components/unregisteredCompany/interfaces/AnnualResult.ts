import {Result} from 'components/unregisteredCompany/interfaces/Result'

export interface AnnualResult{
  monthlyResults: Result[],
  annualResult: Result,
}
