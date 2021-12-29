import {AmountType} from 'src/types/AmountType'
import {ExpenseRate} from 'components/contractWork/types/ExpenseRate'
import {AvailableYear} from 'src/types/AvailableYear'

export interface ContractWorkInputFields {
  year: AvailableYear
  amount: number
  amountType: AmountType,
  expenseRate: ExpenseRate
}
