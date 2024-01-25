import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {CustomInputFields} from 'components/accountingWithSpouse/interfaces/CustomInputFields'
import {CustomResult} from 'components/accountingWithSpouse/interfaces/CustomResult'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import helpers from 'src/logic/helpers'

export class CustomCalculator extends BasicCalculator<CustomInputFields, CustomResult> implements Calculator<CustomInputFields, CustomResult>{
  public calculate():this{
    const incomeTax = new TaxScale()

    const revenueOverTaxReliefLimit = incomeTax.geRevenueOverTaxReliefLimit(this.getInputData().revenue, 0, this.getInputData().hasTaxRelief)
    const taxBasis =  Math.max(helpers.round(revenueOverTaxReliefLimit - this.getInputData().socialContributions - this.getInputData().expenses, 0), 0)
    const taxAmount = incomeTax.getIncomeTax(taxBasis,0, 1)
    const totalContributions= helpers.round(this.getInputData().socialContributions + this.getInputData().healthContributions, 2)
    const income = helpers.round(this.getInputData().revenue - this.getInputData().socialContributions - this.getInputData().healthContributions - this.getInputData().expenses - taxAmount, 2)

    this.result = {
      revenue: this.getInputData().revenue,
      expenses: this.getInputData().expenses,
      socialContributions: this.getInputData().socialContributions,
      healthContributions: this.getInputData().healthContributions,
      totalContributions,
      taxBasis,
      taxAmount,
      income,
    }

    return this
  }
}
