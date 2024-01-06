import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {Result} from 'components/unregisteredCompany/interfaces/Result'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import helpers from 'src/logic/helpers'

export class UnregisteredCompanyCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result>{
  protected readonly incomeTax: TaxScale
  protected isPartOfAnnualResult = false
  protected sumUpTaxBasis = 0

  constructor(isPartOfAnnualResult = false) {
    super()
    this.incomeTax = new TaxScale()
    this.isPartOfAnnualResult = isPartOfAnnualResult
  }

  public calculate(): this {
    const taxBasis =  Math.max(helpers.round(this.getInputData().revenue - this.getInputData().expenses, 0), 0)
    const taxAmount = this.incomeTax.getIncomeTax(taxBasis, this.sumUpTaxBasis, this.getInputData().partTaxReducingAmount)
    const income = helpers.round(this.getInputData().revenue - this.getInputData().expenses - taxAmount, 2)

    this.result = {
      revenue: this.getInputData().revenue,
      expenses: this.getInputData().expenses,
      taxBasis,
      taxAmount,
      income,
    }

    this.sumUpTaxBasis = helpers.round(this.sumUpTaxBasis + taxBasis, 0)

    if(!this.isPartOfAnnualResult) {
      this.sumUpTaxBasis = 0
    }

    return this
  }
}
