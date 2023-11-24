import {ZusContribution} from 'src/logic/zus/ZusContribution'
import helpers from 'src/logic/helpers'

export class EmployerZusContribution extends ZusContribution {
  protected readonly disabilityContributionRate:number = 0.015
  protected readonly pensionContributionRate:number = 0.0976
  protected readonly fpContributionRate:number = 0.01
  protected readonly fgspContributionRate:number = 0.001
  protected readonly fsContributionRate:number = 0.0145

  /**
   * Returns the disability contribution of the employer
   */
  public geDisabilityContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.disabilityContributionRate * basisForContribution, 2)
  }

  /**
   * Returns the pension contribution of the employer
   */
  public gePensionContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.pensionContributionRate * basisForContribution, 2)
  }

  /**
   * Returns the accident contribution of the employer
   * Art. 20. syst. ubezp. społ.:
   * Przy ustalaniu podstawy wymiaru składek na ubezpieczenie wypadkowe nie stosuje się ograniczenia,
   * o którym mowa w art. 19 roczna podstawa wymiaru składek - zasady, skutek przekroczenia ust. 1.
   */
  public getAccidentContribution(grossAmount: number, contributionRate: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round(contributionRate * grossAmount, 2)
  }

  /**
   * Returns the "Fundusz Pracy" contribution of the employer
   * Przy ustalaniu podstawy wymiaru składek na Fundusz Pracy nie stosuje się ograniczenia limitu podstawy składek
   * https://www.zus.pl/pracujacy/fundusze-pozaubezpieczeniowe/fp
   */
  public getFPContribution(grossAmount: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round(this.fpContributionRate * grossAmount, 2)
  }

  /**
   * Returns the "Fundusz Gwarantowanych Świadczeń Pracowniczych" contribution of the employer
   * Przy ustalaniu podstawy wymiaru składek na Fundusz Gwarantowanych Świadczeń Pracowniczych nie stosuje się ograniczenia limitu podstawy składek
   * https://www.zus.pl/pracujacy/fundusze-pozaubezpieczeniowe/fp
   */
  public getFGSPContribution(grossAmount: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round(this.fgspContributionRate * grossAmount, 2)
  }

  /**
   * Returns the "Fundusz Solidarnościowy" contribution of the employer
   * Przy ustalaniu podstawy wymiaru składek na Fundusz Gwarantowanych Świadczeń Pracowniczych nie stosuje się ograniczenia limitu podstawy składek
   * https://www.zus.pl/pracujacy/fundusze-pozaubezpieczeniowe/fp
   */
  public getFSContribution(grossAmount: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round(this.fsContributionRate * grossAmount, 2)
  }

  /**
   * Returns the PPK (Pracownicze Plany Kapitałowe) contribution of the employer
   */
  public getPPKContribution(grossAmount: number, ppkRate = 0.015): number {
    if(grossAmount < 0) {
      return 0
    }

    if(ppkRate < 0.015 || ppkRate > 0.04) {
      throw new Error('Invalid argument. The PPK rate has to be between 1.5% - 4%')
    }

    return helpers.round(ppkRate * grossAmount, 2)
  }
}
