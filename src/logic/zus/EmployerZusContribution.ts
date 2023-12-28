import {ZusAccidentContribution} from 'src/logic/zus/traits/ZusAccidentContribution'
import {ZusContribution} from 'src/logic/zus/ZusContribution'
import {ZusFpContribution} from 'src/logic/zus/traits/ZusFpContribution'
import helpers from 'src/logic/helpers'

export class EmployerZusContribution extends ZusContribution {
  /**
   * Returns the disability contribution of the employer
   */
  public geDisabilityContribution(basisForContribution: number): number {
    if(basisForContribution <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.value.employer.rates.disabilityContribution * basisForContribution, 2)
  }

  /**
   * Returns the pension contribution of the employer
   */
  public gePensionContribution(basisForContribution: number): number {
    if(basisForContribution <= 0) {
      return 0
    }

    return helpers.round(this.zusConstants.value.employer.rates.pensionContribution * basisForContribution, 2)
  }
}

export interface EmployerZusContribution extends ZusFpContribution, ZusAccidentContribution {}
helpers.applyMixins(EmployerZusContribution, [ZusFpContribution, ZusAccidentContribution])
