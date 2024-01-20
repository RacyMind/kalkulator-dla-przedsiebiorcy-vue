import {EmployeeResult as RegularEmployeeResult} from 'src/logic/interfaces/EmployeeResult'

export interface EmployeeResult extends RegularEmployeeResult{
  readonly taxBasisForJointAccounting: number
}
