import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'
import { storeToRefs } from 'pinia'
import { EntrepreneurTaxSystem, useConstantsStore } from 'stores/constantsStore'
import { EntrepreneurZusContribution } from 'src/logic/zus/EntrepreneurZusContribution'
import { InputFields } from 'components/realBoughtCosts/interfaces/InputFields'
import { Result } from 'components/realBoughtCosts/interfaces/Result'
import helpers from 'src/logic/helpers'

export class RealBoughtCostCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
{
  constructor() {
    super()
  }

  public calculate(): this {
    const zus = new EntrepreneurZusContribution()
    const { incomeTaxConstants } = storeToRefs(useConstantsStore())

    const priceWithoutVatTax = helpers.round(
      this.getInputData().price / (1 + this.getInputData().vatTaxRate),
      2,
    )
    const vatTaxAmount = helpers.round(
      this.getInputData().price - priceWithoutVatTax,
      2,
    )
    const deductedVatTaxAmount = helpers.round(
      vatTaxAmount * this.getInputData().deductedVatTaxPart,
      2,
    )
    const deductedIncomeTaxAmount = helpers.round(
      priceWithoutVatTax * this.getInputData().incomeTaxRate,
      2,
    )

    let healthContribution = 0
    if (
      Object.values(incomeTaxConstants.value.taxScale.taxRates).includes(
        this.getInputData().incomeTaxRate,
      )
    ) {
      healthContribution = zus.getHealthContribution(
        priceWithoutVatTax,
        EntrepreneurTaxSystem.TaxScale,
        0,
        0,
        true,
      )
    } else if (
      this.getInputData().incomeTaxRate ===
      incomeTaxConstants.value.flatTax.taxRate
    ) {
      healthContribution = zus.getHealthContribution(
        priceWithoutVatTax,
        EntrepreneurTaxSystem.FlatTax,
        0,
        0,
        true,
      )
    }

    const savedAmount = helpers.round(
      deductedVatTaxAmount + deductedIncomeTaxAmount + healthContribution,
      2,
    )

    const realCost = helpers.round(this.getInputData().price - savedAmount, 2)

    this.result = {
      price: this.getInputData().price,
      vatTaxAmount,
      deductedVatTaxAmount,
      deductedIncomeTaxAmount,
      healthContribution,
      savedAmount,
      realCost,
    }

    return this
  }
}
