import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {ZusAccidentContribution} from 'src/logic/zus/traits/ZusAccidentContribution'
import {ZusContribution} from 'src/logic/zus/ZusContribution'
import {ZusFpContribution} from 'src/logic/zus/traits/ZusFpContribution'
import {useSettingStore} from 'stores/settingStore'
import helpers from 'src/logic/helpers'

export class EntrepreneurZusContribution extends ZusContribution {
  protected settingStore

  constructor() {
    super()

    this.settingStore = useSettingStore()
  }

  /**
   * Returns the health contribution of the entrepreneur
   */
  public getHealthContribution(healthContributionBasis: number, taxSystem: EntrepreneurTaxSystem, monthIndex = this.settingStore.dateOfLawRules.getMonth(), yearlyIncome = 0, ignoreMinimumContribution = false): number {
    const {wageStats} = useConstants()

    let year = this.settingStore.dateOfLawRules.getFullYear()

    if (monthIndex === 0) {
      // the contribution year is from February to January.
      // It's the reason why it's necessary
      // to take the minimum wage from previous year for January
      year -= 1
    }

    // we always take the minimum wage from the beginning of the year to calculate the contribution
    let basisForMinimumContribution = wageStats.value.minimumWage(year, 0)
    if(year >= 2025 && monthIndex > 0) {
      // https://poradnikprzedsiebiorcy.pl/-nowy-polski-lad-skladka-zdrowotna-uzalezniona-od-dochodu-i-bez-odliczenia
      basisForMinimumContribution = 0.75 * basisForMinimumContribution
    }
    const minimumContribution = ignoreMinimumContribution ? 0 : helpers.round(this.zusConstants.value.entrepreneur.rates.healthContribution.taxScales * basisForMinimumContribution, 2)

    let contribution: number

    switch (taxSystem) {
      case EntrepreneurTaxSystem.TaxScale:
        contribution = helpers.round(this.zusConstants.value.entrepreneur.rates.healthContribution.taxScales * healthContributionBasis, 2)
        return Math.max(contribution, minimumContribution)

      case EntrepreneurTaxSystem.FlatTax:
        contribution = helpers.round(this.zusConstants.value.entrepreneur.rates.healthContribution.flatTax * healthContributionBasis, 2)
        return Math.max(contribution, minimumContribution)

      case EntrepreneurTaxSystem.LumpSumTax:
        let contributionBasis = helpers.round(1.8 * wageStats.value.averageWageInLastQuarter(this.settingStore.dateOfLawRules.getFullYear() - 1), 2)

        if (yearlyIncome <= 300000) {
          contributionBasis = helpers.round(wageStats.value.averageWageInLastQuarter(this.settingStore.dateOfLawRules.getFullYear() - 1), 2)
        }
        if (yearlyIncome <= 60000) {
          contributionBasis = helpers.round(0.6 * wageStats.value.averageWageInLastQuarter(this.settingStore.dateOfLawRules.getFullYear() - 1), 2)
        }

        return helpers.round(this.zusConstants.value.entrepreneur.rates.healthContribution.taxScales * contributionBasis, 2)

      default:
        throw Error('Invalid tax system')
    }
  }

    /**
     * Returns the deductible health contribution of the entrepreneur
     */
  public getDeductibleHealthContribution(healthContribution: number, taxSystem: EntrepreneurTaxSystem, sumUpDeductibleHealthContribution = 0): number {
    const { incomeTaxConstants } = useConstants()

      switch (taxSystem) {
        case EntrepreneurTaxSystem.TaxScale:
          return 0

        case EntrepreneurTaxSystem.FlatTax:
          if(sumUpDeductibleHealthContribution >= incomeTaxConstants.value.flatTax.deductibleHealthContributionLimit) {
            return 0
          }
          if(healthContribution + sumUpDeductibleHealthContribution >= incomeTaxConstants.value.flatTax.deductibleHealthContributionLimit) {
            return helpers.round(incomeTaxConstants.value.flatTax.deductibleHealthContributionLimit - sumUpDeductibleHealthContribution, 2)
          }
          return healthContribution

        case EntrepreneurTaxSystem.LumpSumTax:
          return helpers.round(0.5 * healthContribution, 2)

        default:
          throw Error('Invalid tax system')
      }
    }

  /**
   * Returns the disability contribution of the entrepreneur
   */
  public geDisabilityContribution(contributionBasis: number): number {
    if(contributionBasis <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.value.entrepreneur.rates.disabilityContribution * contributionBasis, 2)
  }

  /**
   * Returns the pension contribution of the entrepreneur
   */
  public gePensionContribution(contributionBasis: number): number {
    if(contributionBasis <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.value.entrepreneur.rates.pensionContribution * contributionBasis, 2)
  }

  /**
   * Returns the pension contribution of the employee
   * Art. 20. syst. ubezp. społ.:
   * Przy ustalaniu podstawy wymiaru składek na ubezpieczenie chorobowe nie stosuje się ograniczenia,
   * o którym mowa w art. 19 roczna podstawa wymiaru składek - zasady, skutek przekroczenia ust. 1.
   */
  public getSickContribution(contributionBasis: number): number {
    if(contributionBasis <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.value.entrepreneur.rates.sickContribution * contributionBasis, 2)
  }
}

export interface EntrepreneurZusContribution extends ZusFpContribution, ZusAccidentContribution {}
helpers.applyMixins(EntrepreneurZusContribution, [ZusFpContribution, ZusAccidentContribution])
