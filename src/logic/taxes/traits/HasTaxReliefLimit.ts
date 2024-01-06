import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class HasTaxReliefLimit{

  /**
   * Returns the salary amount over the tax relief limit. This amount is important for tax calculations
   */
  public geRevenueOverTaxReliefLimit(revenue: number, sumUpRevenue:number, hasTaxRelief:boolean): number{
    const {incomeTaxConstnts} = useConstants()

    if(!hasTaxRelief) {
      return revenue
    }

    if(sumUpRevenue > incomeTaxConstnts.value.taxReliefLimit) {
      return revenue
    }
    if(sumUpRevenue + revenue > incomeTaxConstnts.value.taxReliefLimit) {
      return helpers.round(sumUpRevenue + revenue -  incomeTaxConstnts.value.taxReliefLimit, 2)
    }

    return 0
  }
}
