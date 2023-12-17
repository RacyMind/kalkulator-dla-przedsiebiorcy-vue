import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import helpers from 'src/logic/helpers'

export type LumpSumTaxRate = 0.17 | 0.15 | 0.14 | 0.125 | 0.12 | 0.1 | 0.85 | 0.055 | 0.03 | 0.02

export class LumpSumTax{
  public getIncomeTax(taxBasis:number, rate: LumpSumTaxRate):number {
    if(taxBasis <= 0) {
      return 0
    }
    return helpers.round(rate * taxBasis)
  }
}

export interface LumpSumTax extends HasTaxReliefLimit {}
helpers.applyMixins(LumpSumTax, [HasTaxReliefLimit])
