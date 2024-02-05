import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {InputFields} from 'components/realBoughtCosts/interfaces/InputFields'
import {Result} from 'components/realBoughtCosts/interfaces/Result'
import helpers from 'src/logic/helpers'

export class RealBoughtCostCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result>{

  constructor() {
    super()
  }

  public calculate(): this {
    const priceWithoutTax = helpers.round(this.getInputData().price / (1 + this.getInputData().vatTaxRate), 2)
    const vatTaxAmount = helpers.round(this.getInputData().price - priceWithoutTax, 2)
    const deductedVatTaxAmount = helpers.round(vatTaxAmount * this.getInputData().deductedVatTaxPart, 2)
    const deductedIncomeTaxAmount = helpers.round(priceWithoutTax * this.getInputData().incomeTaxRate, 2)

    const savedAmount = helpers.round(deductedVatTaxAmount + deductedIncomeTaxAmount, 2)

    this.result = {
      price: this.getInputData().price,
      vatTaxAmount,
      deductedVatTaxAmount,
      deductedIncomeTaxAmount,
      savedAmount,
    }

    return this
  }
}
