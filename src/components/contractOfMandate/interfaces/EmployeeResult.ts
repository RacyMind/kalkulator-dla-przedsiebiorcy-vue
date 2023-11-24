import {EmployeeZusResult} from 'src/logic/zus/interfaces/EmployeeZusResult'
import {GeneralRuleResult} from 'src/logic/taxes/interfaces/GeneralRuleResult'

export interface EmployeeResult extends EmployeeZusResult, GeneralRuleResult{
  readonly grossAmount: number,
  readonly netAmount: number,
}
