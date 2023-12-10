import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class FlatTax{
  protected readonly incomeTaxConstants

  public constructor() {
    const { incomeTaxConstnts} = useConstants()
    this.incomeTaxConstants = incomeTaxConstnts
  }
  public getIncomeTax(taxBasis:number):number {
    return helpers.round(this.incomeTaxConstants.flatTax.taxRate * taxBasis)
  }
}
