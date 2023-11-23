export class  ZusContribution{
  /**
   * the limit of basis for sick, pension and disability contributions
   */
  public static readonly contributionBasisLimit:number = 208050

  /**
   * Returns the basis for sick, pension and disability contributions
   */
  public getContributionBasis(grossAmount:number, sumUpContributionBasis = 0): number {
    if(grossAmount < 0) {
      return 0
    }

    if(sumUpContributionBasis >= ZusContribution.contributionBasisLimit) {
      return 0
    }

    if(grossAmount + sumUpContributionBasis > ZusContribution.contributionBasisLimit) {
      return ZusContribution.contributionBasisLimit - sumUpContributionBasis
    }

    return grossAmount
  }

}
