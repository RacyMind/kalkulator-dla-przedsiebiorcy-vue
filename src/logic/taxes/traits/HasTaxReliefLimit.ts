import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class HasTaxReliefLimit{

  /**
   * Returns the salary amount over the tax relief limit. This amount is important for tax calculations
   */
  public geRevenueOverTaxReliefLimit(revenue: number, sumUpRevenue:number, hasTaxRelief:boolean): number{
    const {incomeTaxConstants} = useConstants()

    if(!hasTaxRelief) {
      return revenue
    }

    if(sumUpRevenue > incomeTaxConstants.value.taxReliefLimit) {
      return revenue
    }
    if(sumUpRevenue + revenue > incomeTaxConstants.value.taxReliefLimit) {
      return helpers.round(sumUpRevenue + revenue -  incomeTaxConstants.value.taxReliefLimit, 2)
    }

    return 0
  }
}
