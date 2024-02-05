export interface Result{
  readonly price: number
  readonly vatTaxAmount: number
  readonly deductedVatTaxAmount: number
  readonly deductedIncomeTaxAmount: number
  readonly savedAmount: number
}
