import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class TaxScale {
  protected readonly incomeTaxConstants
  protected annualTaxReducingAmount:number

  public constructor() {
    const { incomeTaxConstnts} = useConstants()

    this.incomeTaxConstants = incomeTaxConstnts
    this.annualTaxReducingAmount = this.incomeTaxConstants.taxScale.taxFreeAmount * this.incomeTaxConstants.taxScale.taxRates.first
  }

  public getAuthorExpenses(basisForAuthorExpenses:number, partOfWorkWithAuthorExpenses: number, hasTaxRelief: boolean, sumUpAuthorExpenses:number):number {
    if (!partOfWorkWithAuthorExpenses) {
      return 0
    }
    if (basisForAuthorExpenses <= 0) {
      return 0
    }

    let realThreshold = this.incomeTaxConstants.taxScale.taxThreshold

    if(hasTaxRelief) {
      // it's reduced because the sum of the tax relief and the expense limit can't be more than the the tax threshold
      realThreshold = this.incomeTaxConstants.taxScale.taxThreshold - this.incomeTaxConstants.taxReliefLimit
    }

    if(sumUpAuthorExpenses >= realThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForAuthorExpenses * partOfWorkWithAuthorExpenses * this.incomeTaxConstants.taxScale.expenses.rates.author, 2)

    if(expenses + sumUpAuthorExpenses > realThreshold) {
      return realThreshold - sumUpAuthorExpenses
    }

    return expenses
  }

  /**
   *
   * @param partTaxReducingAmount 0 - no tax reducing amount, 1 - the annual tax reducing amount, 12 - the monthly tax reducing amount
   */
  public getIncomeTax(taxBasis:number, sumUpTaxBasis:number, partTaxReducingAmount: number):number {
    let taxAmount:number

    // If the total basis for the tax is grater than the amount of the tax threshold, there is the second tax rate
    if (sumUpTaxBasis > this.incomeTaxConstants.taxScale.taxThreshold) {
      taxAmount = taxBasis * this.incomeTaxConstants.taxScale.taxRates.second
    } else if (taxBasis + sumUpTaxBasis > this.incomeTaxConstants.taxScale.taxThreshold) {
      // first rate
      taxAmount = (this.incomeTaxConstants.taxScale.taxThreshold - sumUpTaxBasis) * this.incomeTaxConstants.taxScale.taxRates.first
      // second rate
      taxAmount += (taxBasis + sumUpTaxBasis - this.incomeTaxConstants.taxScale.taxThreshold) * this.incomeTaxConstants.taxScale.taxRates.second
    } else {
      taxAmount = taxBasis * this.incomeTaxConstants.taxScale.taxRates.first
    }

    if(partTaxReducingAmount) {
      taxAmount -= this.annualTaxReducingAmount / partTaxReducingAmount
    }

    if (taxAmount < 0) {
      return  0
    }

    return helpers.round(taxAmount)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GeneraLRule extends HasTaxReliefLimit {}
helpers.applyMixins(TaxScale, [HasTaxReliefLimit])