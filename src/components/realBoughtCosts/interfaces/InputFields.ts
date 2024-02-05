import {AvailableVatRate} from 'src/logic/taxes/interfaces/AvailableVatRate'

export interface InputFields{
  price: number
  vatTaxRate: AvailableVatRate
  deductedVatTaxPart: 0 | 0.5 | 1
  incomeTaxRate: 0 | 0.12 | 0.19 | 0.32
}
