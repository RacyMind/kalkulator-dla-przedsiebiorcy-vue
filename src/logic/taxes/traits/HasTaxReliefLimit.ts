import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class HasTaxReliefLimit{

  /**
   * Returns the salary amount over the tax relief limit. This amount is important for tax calculations
   */
  public getSalaryAmountOverTaxReliefLimit(grossAmount: number, sumUpGrossAmount:number, hasTaxRelief:boolean): number{
    const {incomeTaxConstnts} = useConstants()

    if(!hasTaxRelief) {
      return grossAmount
    }

    if(sumUpGrossAmount > incomeTaxConstnts.taxReliefLimit) {
      return grossAmount
    }
    if(sumUpGrossAmount + grossAmount > incomeTaxConstnts.taxReliefLimit) {
      return helpers.round(sumUpGrossAmount + grossAmount -  incomeTaxConstnts.taxReliefLimit, 2)
    }

    return 0
  }
}
