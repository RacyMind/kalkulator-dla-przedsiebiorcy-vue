import {EmployeeZusResult} from 'src/logic/zus/interfaces/EmployeeZusResult'
import {IncomeTaxResult} from 'src/logic/taxes/interfaces/IncomeTaxResult'

export interface EmployeeResult extends EmployeeZusResult, IncomeTaxResult{
  readonly grossAmount: number,
  readonly netAmount: number,
  readonly ppkIncomeFromEmployer: number,
}
