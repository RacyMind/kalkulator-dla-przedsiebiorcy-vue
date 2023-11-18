import helpers from 'src/logic/helpers'

export class EmployeeZusContribution{
  protected readonly healthContributionRate:number = 0.09
  protected readonly disabilityContributionRate:number = 0.015
  protected readonly pensionContributionRate:number = 0.0976
  protected readonly sickContributionRate:number = 0.0245
  /**
   * the limit of basis for sick, pension and disability contributions
   */
  public static readonly limitOfBasisForContributions:number = 208050

  /**
   * Returns the health contribution of the employee
   */
  public getHealthContribution(amount: number): number {
    if(amount < 0) {
      return 0
    }

    return helpers.round(this.healthContributionRate * amount, 2)
  }

  /**
   * Returns the disability contribution of the employee
   */
  public geDisabilityContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.disabilityContributionRate * basisForContribution, 2)
  }

  /**
   * Returns the pension contribution of the employee
   */
  public gePensionContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.pensionContributionRate * basisForContribution, 2)
  }

  /**
   * Returns the pension contribution of the employee
   */
  public getSickContribution(basisForContribution: number): number {
    if(basisForContribution < 0) {
      return 0
    }

    return helpers.round(this.sickContributionRate * basisForContribution, 2)
  }

  /**
   * Returns the PPK (Pracownicze Plany Kapitałowe) contribution of the employee
   */
  public getPPKContribution(grossAmount: number, ppkRate = 0.02): number {
    if(grossAmount < 0) {
      return 0
    }

    if(ppkRate < 0.005 || ppkRate > 0.04) {
      throw new Error('Invalid argument. The PPK rate has to be between 0.05% - 4%')
    }

    return helpers.round(ppkRate * grossAmount, 2)
  }

  /**
   * Returns the basis for sick, pension and disability contributions
   */
  public getBasisForContributions(grossAmount:number, sumUpBasisForContributions = 0): number {
    if(grossAmount < 0) {
      return 0
    }

    if(sumUpBasisForContributions >= EmployeeZusContribution.limitOfBasisForContributions) {
      return 0
    }

    if(grossAmount + sumUpBasisForContributions > EmployeeZusContribution.limitOfBasisForContributions) {
      return EmployeeZusContribution.limitOfBasisForContributions - sumUpBasisForContributions
    }

    return grossAmount
  }
}
