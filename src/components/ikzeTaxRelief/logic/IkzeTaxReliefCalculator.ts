import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {FlatTax} from 'src/logic/taxes/FlatTax'
import {IkzeTaxSystem} from 'components/ikzeTaxRelief/types/IkzeTaxSystem'
import {InputFields} from 'components/ikzeTaxRelief/interfaces/InputFields'
import {LumpSumTax} from 'src/logic/taxes/LumpSumTax'
import {Result} from 'components/ikzeTaxRelief/interfaces/Result'
import {TaxScale} from 'src/logic/taxes/TaxScale'
import {getIkzeLimit} from 'src/logic/ikzeLimits'
import {useSettingStore} from 'stores/settingStore'
import helpers from 'src/logic/helpers'

export class IkzeTaxReliefCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result> {
  protected readonly taxScale: TaxScale
  protected readonly flatTax: FlatTax
  protected readonly lumpSumTax: LumpSumTax
  protected readonly settingStore

  constructor() {
    super()
    this.taxScale = new TaxScale()
    this.flatTax = new FlatTax()
    this.lumpSumTax = new LumpSumTax()
    this.settingStore = useSettingStore()
  }

  protected getTaxBeforeRelief(): number {
    const input = this.getInputData()
    const taxBase = Math.max(helpers.round(input.taxBaseBeforeRelief, 0), 0)

    switch (input.taxSystem) {
      case IkzeTaxSystem.TaxScale:
        return this.taxScale.getIncomeTax(taxBase, 0, 0)
      case IkzeTaxSystem.FlatTax:
        return this.flatTax.getIncomeTax(taxBase)
      case IkzeTaxSystem.LumpSum:
        if (!input.lumpSumTaxRate) {
          throw new Error('Lump sum tax rate is required for lump sum tax system')
        }
        return this.lumpSumTax.getIncomeTax(taxBase, input.lumpSumTaxRate)
      default:
        throw new Error(`Unknown tax system: ${input.taxSystem}`)
    }
  }

  protected getTaxAfterRelief(taxBaseAfterRelief: number): number {
    const input = this.getInputData()
    const taxBase = Math.max(helpers.round(taxBaseAfterRelief, 0), 0)

    switch (input.taxSystem) {
      case IkzeTaxSystem.TaxScale:
        return this.taxScale.getIncomeTax(taxBase, 0, 0)
      case IkzeTaxSystem.FlatTax:
        return this.flatTax.getIncomeTax(taxBase)
      case IkzeTaxSystem.LumpSum:
        if (!input.lumpSumTaxRate) {
          throw new Error('Lump sum tax rate is required for lump sum tax system')
        }
        return this.lumpSumTax.getIncomeTax(taxBase, input.lumpSumTaxRate)
      default:
        throw new Error(`Unknown tax system: ${input.taxSystem}`)
    }
  }

  public calculate(): this {
    const input = this.getInputData()
    const ikzeLimit = getIkzeLimit(this.settingStore.dateOfLawRules, input.status)

    const taxBaseAfterRelief = Math.max(helpers.round(input.taxBaseBeforeRelief - input.ikzeContribution, 2), 0)
    const taxBeforeRelief = this.getTaxBeforeRelief()
    const taxAfterRelief = this.getTaxAfterRelief(taxBaseAfterRelief)
    const taxSaving = helpers.round(taxBeforeRelief - taxAfterRelief, 2)

    this.result = {
      status: input.status,
      taxSystem: input.taxSystem,
      ikzeLimit,
      ikzeContribution: input.ikzeContribution,
      taxBaseBeforeRelief: input.taxBaseBeforeRelief,
      taxBaseAfterRelief,
      taxBeforeRelief,
      taxAfterRelief,
      taxSaving,
    }

    return this
  }
}
