import {EmployeeResult} from 'components/contractOfMandate/interfaces/EmployeeResult'

export interface AnnualEmployeeResult{
  monthlyResults: EmployeeResult[],
  annualResult: EmployeeResult,
}
