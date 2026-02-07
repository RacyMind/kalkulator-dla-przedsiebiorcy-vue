import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

export class FlatTax{
  protected readonly incomeTaxConstants

  public constructor() {
    const { incomeTaxConstants} = storeToRefs(useConstantsStore())
    this.incomeTaxConstants = incomeTaxConstants
  }
  public getIncomeTax(taxBasis:number):number {
    return helpers.round(this.incomeTaxConstants.value.flatTax.taxRate * taxBasis)
  }
}

 
export interface FlatTax extends HasTaxReliefLimit {}
helpers.applyMixins(FlatTax, [HasTaxReliefLimit])
