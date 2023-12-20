import {useConstants} from 'src/composables/constants'

export class  ZusContribution{
  protected readonly zusConstants

  constructor() {
    const {zusConstants} = useConstants()
    this.zusConstants = zusConstants
  }

  /**
   * Returns the basis for sick, pension and disability contributions
   */
  public getContributionBasisWithinLimit(grossAmount:number, sumUpContributionBasis = 0): number {
    if(grossAmount < 0) {
      return 0
    }

    if(sumUpContributionBasis >= this.zusConstants.contributionBasisLimit) {
      return 0
    }

    if(grossAmount + sumUpContributionBasis > this.zusConstants.contributionBasisLimit) {
      return this.zusConstants.contributionBasisLimit - sumUpContributionBasis
    }

    return grossAmount
  }

}
