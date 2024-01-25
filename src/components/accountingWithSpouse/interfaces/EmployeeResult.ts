import {EmployeeResult as RegularEmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import {SpouseResult} from 'components/accountingWithSpouse/interfaces/SpouseResult'

export interface EmployeeResult extends RegularEmployeeResult, SpouseResult{
}
