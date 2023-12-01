import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'

export interface AnnualEmployeeResult{
  monthlyResults: EmployeeResult[],
  annualResult: EmployeeResult,
}
