import {ZusAccidentContribution} from 'src/logic/zus/traits/ZusAccidentContribution'
import {ZusContribution} from 'src/logic/zus/ZusContribution'
import {ZusFpContribution} from 'src/logic/zus/traits/ZusFpContribution'
import helpers from 'src/logic/helpers'

export class EntrepreneurZusContribution extends ZusContribution {
  /**
   * Returns the disability contribution of the employer
   */
  public geDisabilityContribution(contributionBasis: number): number {
    if(contributionBasis <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.entrepreneur.rates.disabilityContribution * contributionBasis, 2)
  }

  /**
   * Returns the pension contribution of the entrepreneur
   */
  public gePensionContribution(contributionBasis: number): number {
    if(contributionBasis <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.entrepreneur.rates.pensionContribution * contributionBasis, 2)
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

    return helpers.round(this.zusConstants.entrepreneur.rates.sickContribution * contributionBasis, 2)
  }
}

export interface EntrepreneurZusContribution extends ZusFpContribution, ZusAccidentContribution {}
helpers.applyMixins(EntrepreneurZusContribution, [ZusFpContribution, ZusAccidentContribution])
