import {HasTaxReliefLimit} from 'src/logic/taxes/traits/HasTaxReliefLimit'
import {useConstants} from 'src/composables/constants'
import helpers from 'src/logic/helpers'

export class TaxScale {
  protected readonly incomeTaxConstants
  protected annualTaxReducingAmount:number

  public constructor() {
    const { incomeTaxConstants} = useConstants()

    this.incomeTaxConstants = incomeTaxConstants
    this.annualTaxReducingAmount = this.incomeTaxConstants.value.taxScale.taxFreeAmount * this.incomeTaxConstants.value.taxScale.taxRates.first
  }

  public getAuthorExpenses(basisForAuthorExpenses:number, partOfWorkWithAuthorExpenses: number, hasTaxRelief: boolean, sumUpAuthorExpenses:number):number {
    if (!partOfWorkWithAuthorExpenses) {
      return 0
    }
    if (basisForAuthorExpenses <= 0) {
      return 0
    }

    let realThreshold = this.incomeTaxConstants.value.taxScale.taxThreshold

    if(hasTaxRelief) {
      // it's reduced because the sum of the tax relief and the expense limit can't be more than the tax threshold
      realThreshold = this.incomeTaxConstants.value.taxScale.taxThreshold - this.incomeTaxConstants.value.taxReliefLimit
    }

    if(sumUpAuthorExpenses >= realThreshold) {
      return 0
    }

    const expenses = helpers.round(basisForAuthorExpenses * partOfWorkWithAuthorExpenses * this.incomeTaxConstants.value.taxScale.expenses.rates.author, 2)

    if(expenses + sumUpAuthorExpenses > realThreshold) {
      return realThreshold - sumUpAuthorExpenses
    }

    return expenses
  }

  /**
   *
   * @param taxBasis
   * @param sumUpTaxBasis
   * @param partTaxReducingAmount 0 - no tax reducing amount, 1 - the annual tax reducing amount, 12 - the monthly tax reducing amount
   */
  public getIncomeTax(taxBasis:number, sumUpTaxBasis:number, partTaxReducingAmount: number):number {
    let taxAmount:number

    // If the total basis for the tax is grater than the amount of the tax threshold, there is the second tax rate
    if (sumUpTaxBasis > this.incomeTaxConstants.value.taxScale.taxThreshold) {
      taxAmount = taxBasis * this.incomeTaxConstants.value.taxScale.taxRates.second
    } else if (taxBasis + sumUpTaxBasis > this.incomeTaxConstants.value.taxScale.taxThreshold) {
      // the first rate
      taxAmount = (this.incomeTaxConstants.value.taxScale.taxThreshold - sumUpTaxBasis) * this.incomeTaxConstants.value.taxScale.taxRates.first
      // the second rate
      taxAmount += (taxBasis + sumUpTaxBasis - this.incomeTaxConstants.value.taxScale.taxThreshold) * this.incomeTaxConstants.value.taxScale.taxRates.second
    } else {
      taxAmount = taxBasis * this.incomeTaxConstants.value.taxScale.taxRates.first
    }

    if(partTaxReducingAmount) {
      taxAmount -= this.annualTaxReducingAmount / partTaxReducingAmount
    }

    if (taxAmount < 0) {
      return  0
    }

    return helpers.round(taxAmount)
  }

  public getTaxFreeAmount(taxAmount:number, sumUpTaxFreeAmount = 0): number {
    if(taxAmount <= 0) {
      return 0
    }

    if(sumUpTaxFreeAmount >= this.annualTaxReducingAmount) {
      return 0
    }

    if(taxAmount + sumUpTaxFreeAmount > this.annualTaxReducingAmount) {
      return this.annualTaxReducingAmount - sumUpTaxFreeAmount
    }

    return taxAmount
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaxScale extends HasTaxReliefLimit {}
helpers.applyMixins(TaxScale, [HasTaxReliefLimit])
