export class  ZusContribution{
  /**
   * the limit of basis for sick, pension and disability contributions
   */
  public static readonly limitOfBasisForContributions:number = 208050

  /**
   * Returns the basis for sick, pension and disability contributions
   */
  public getBasisForContributions(grossAmount:number, sumUpBasisForContributions = 0): number {
    if(grossAmount < 0) {
      return 0
    }

    if(sumUpBasisForContributions >= ZusContribution.limitOfBasisForContributions) {
      return 0
    }

    if(grossAmount + sumUpBasisForContributions > ZusContribution.limitOfBasisForContributions) {
      return ZusContribution.limitOfBasisForContributions - sumUpBasisForContributions
    }

    return grossAmount
  }

}
