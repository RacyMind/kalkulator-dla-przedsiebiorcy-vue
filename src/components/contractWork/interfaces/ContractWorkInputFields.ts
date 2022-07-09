import {AmountType} from 'src/types/AmountType'
import {AvailableYear} from 'src/types/AvailableYear'
import {ExpenseRate} from 'components/contractWork/types/ExpenseRate'

export interface ContractWorkInputFields {
  year: AvailableYear
  amount: number
  amountType: AmountType,
  expenseRate: ExpenseRate
}
