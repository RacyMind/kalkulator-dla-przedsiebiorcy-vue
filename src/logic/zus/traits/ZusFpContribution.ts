import {ZusContribution} from 'src/logic/zus/ZusContribution'
import helpers from 'src/logic/helpers'

export class ZusFpContribution extends ZusContribution {

  /**
   * Returns the "Fundusz Pracy" contribution of the employer
   * Przy ustalaniu podstawy wymiaru składek na Fundusz Pracy nie stosuje się ograniczenia limitu podstawy składek
   * https://www.zus.pl/pracujacy/fundusze-pozaubezpieczeniowe/fp
   */
  public getFPContribution(grossAmount: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round(this.zusConstants.value.employer.rates.fpContribution * grossAmount, 2)
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

    return helpers.round(this.zusConstants.value.employer.rates.fgspContribution * grossAmount, 2)
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

    return helpers.round(this.zusConstants.value.employer.rates.fsContribution * grossAmount, 2)
  }

  /**
   * Returns the sum of "Fundusz Pracy" and " "Fundusz Solidarnościowy" contributions of the employer
   * Przy ustalaniu podstawy wymiaru składek nie stosuje się ograniczenia limitu podstawy składek
   * https://www.zus.pl/pracujacy/fundusze-pozaubezpieczeniowe/fp
   */
  public getFPandFSPContribution(grossAmount: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round((this.zusConstants.value.employer.rates.fpContribution + this.zusConstants.value.employer.rates.fsContribution) * grossAmount, 2)
  }

  /**
   * Returns the PPK (Pracownicze Plany Kapitałowe) contribution of the employer
   */
  public getPPKContribution(grossAmount: number, ppkRate = this.zusConstants.value.employer.rates.ppkContribution.default): number {
    if(grossAmount < 0) {
      return 0
    }

    if(ppkRate < this.zusConstants.value.employer.rates.ppkContribution.min || ppkRate > this.zusConstants.value.employer.rates.ppkContribution.max) {
      throw new Error('Invalid argument. The PPK rate has to be between 1.5% - 4%')
    }

    return helpers.round(ppkRate * grossAmount, 2)
  }
}
