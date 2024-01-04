import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class FlatTax{
  protected readonly incomeTaxConstants

  public constructor() {
    const { incomeTaxConstnts} = useConstants()
    this.incomeTaxConstants = incomeTaxConstnts
  }
  public getIncomeTax(taxBasis:number):number {
    return helpers.round(this.incomeTaxConstants.value.flatTax.taxRate * taxBasis)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FlatTax extends HasTaxReliefLimit {}
helpers.applyMixins(FlatTax, [HasTaxReliefLimit])
