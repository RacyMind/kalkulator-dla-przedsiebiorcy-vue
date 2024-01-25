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

  public getZusContributions(
    grossAmount: number,
    contributionBasis: number,
    isPensionContribution: boolean,
    isDisabilityContribution: boolean,
    isFpContribution: boolean,
    isFgspContribution: boolean,
    accidentContributionRate: number,
    ppkContributionRate: number,
  ) {
    const pensionContribution = isPensionContribution ? this.gePensionContribution(contributionBasis) : 0
    const disabilityContribution = isDisabilityContribution ? this.geDisabilityContribution(contributionBasis) : 0
    const fpContribution = isFpContribution ? this.getFPContribution(grossAmount) : 0
    const fsContribution = isFpContribution ? this.getFSContribution(grossAmount) : 0
    const fgspContribution = isFgspContribution ? this.getFGSPContribution(grossAmount) : 0
    const accidentContribution = accidentContributionRate ? this.getAccidentContribution(grossAmount, accidentContributionRate) : 0
    const ppkContribution = ppkContributionRate ? this.getPPKContribution(grossAmount, ppkContributionRate) : 0

    return {
      pensionContribution,
      disabilityContribution,
      fpContribution,
      fsContribution,
      fgspContribution,
      accidentContribution,
      ppkContribution,
    }
  }
}

export interface EmployerZusContribution extends ZusFpContribution, ZusAccidentContribution {}
helpers.applyMixins(EmployerZusContribution, [ZusFpContribution, ZusAccidentContribution])
