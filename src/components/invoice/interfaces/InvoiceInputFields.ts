import {AmountType} from 'src/types/AmountType'
import {VatTaxRate} from 'src/types/VatTaxRate'

export interface InvoiceInputFields {
  amount: number
  amountType: AmountType
  taxRate: VatTaxRate
}
