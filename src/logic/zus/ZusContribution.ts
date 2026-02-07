import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'

export class ZusContribution{
  protected readonly zusConstants

  constructor() {
    const {zusConstants} = storeToRefs(useConstantsStore())
    this.zusConstants = zusConstants
  }

  /**
   * Returns the basis for sick, pension and disability contributions
   */
  public getContributionBasisWithinLimit(grossAmount:number, sumUpContributionBasis = 0): number {
    if(grossAmount < 0) {
      return 0
    }

    if(sumUpContributionBasis >= this.zusConstants.value.contributionBasisLimit) {
      return 0
    }

    if(grossAmount + sumUpContributionBasis > this.zusConstants.value.contributionBasisLimit) {
      return this.zusConstants.value.contributionBasisLimit - sumUpContributionBasis
    }

    return grossAmount
  }

}
