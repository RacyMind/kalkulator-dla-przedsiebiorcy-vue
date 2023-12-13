import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class HasTaxReliefLimit{

  /**
   * Returns the salary amount over the tax relief limit. This amount is important for tax calculations
   */
  public geIncomeOverTaxReliefLimit(income: number, sumUpIncome:number, hasTaxRelief:boolean): number{
    const {incomeTaxConstnts} = useConstants()

    if(!hasTaxRelief) {
      return income
    }

    if(sumUpIncome > incomeTaxConstnts.taxReliefLimit) {
      return income
    }
    if(sumUpIncome + income > incomeTaxConstnts.taxReliefLimit) {
      return helpers.round(sumUpIncome + income -  incomeTaxConstnts.taxReliefLimit, 2)
    }

    return 0
  }
}
