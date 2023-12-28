import helpers from 'src/logic/helpers'

export class ZusAccidentContribution {
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
}
