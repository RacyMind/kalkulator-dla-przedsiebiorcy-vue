import {ZusContribution} from 'src/logic/zus/ZusContribution'
import helpers from 'src/logic/helpers'

export class EmployeeZusContribution extends ZusContribution {

  /**
   * Returns the health contribution of the employee
   */
  public getHealthContribution(amount: number): number {
    if(amount < 0) {
      return 0
    }

    return helpers.round(this.zusConstants.employee.rates.healthContribution * amount, 2)
  }

  /**
   * Returns the disability contribution of the employee
   */
  public geDisabilityContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.zusConstants.employee.rates.disabilityContribution * basisForContribution, 2)
  }

  /**
   * Returns the pension contribution of the employee
   */
  public gePensionContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.zusConstants.employee.rates.pensionContribution * basisForContribution, 2)
  }

  /**
   * Returns the pension contribution of the employee
   * Art. 20. syst. ubezp. społ.:
   * Przy ustalaniu podstawy wymiaru składek na ubezpieczenie chorobowe nie stosuje się ograniczenia,
   * o którym mowa w art. 19 roczna podstawa wymiaru składek - zasady, skutek przekroczenia ust. 1.
   */
  public getSickContribution(grossAmount: number): number {
    if(grossAmount < 0) {
      return 0
    }

    return helpers.round(this.zusConstants.employee.rates.sickContribution * grossAmount, 2)
  }

  /**
   * Returns the PPK (Pracownicze Plany Kapitałowe) contribution of the employee
   */
  public getPPKContribution(grossAmount: number, ppkRate = this.zusConstants.employee.rates.ppkContribution.default): number {
    if(grossAmount < 0) {
      return 0
    }

    if(ppkRate < this.zusConstants.employee.rates.ppkContribution.min || ppkRate > this.zusConstants.employee.rates.ppkContribution.max) {
      throw new Error('Invalid argument. The PPK rate has to be between 0.5% - 4%')
    }

    return helpers.round(ppkRate * grossAmount, 2)
  }
}
