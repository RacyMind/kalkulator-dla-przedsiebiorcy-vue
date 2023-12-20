import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EntrepreneurZusContribution} from 'src/logic/zus/EntrepreneurZusContribution'
import {InputFields} from 'components/partialZusContributions/interfaces/InputFields'
import {Result} from 'components/partialZusContributions/interfaces/Result'
import {useSettingStore} from 'stores/settingStore'
import helpers from 'src/logic/helpers'

export class ContributionCalculator extends BasicCalculator<InputFields, Result> implements Calculator<InputFields, Result>{
  zus: EntrepreneurZusContribution

  constructor() {
    super()
    this.zus = new EntrepreneurZusContribution()
  }

  public calculate(): this {
    let accidentContribution = 0
    let sickContribution = 0
    let fpContribution = 0
    let fsContribution = 0

    let actualContributionBasis = this.getInputData().contributionBasis
    actualContributionBasis = actualContributionBasis / this.getDaysInMonth(this.getInputData().monthIndex)
    actualContributionBasis = helpers.round(actualContributionBasis * this.getInputData().daysOfRunningBusiness, 2)

    const contributionBasisWithnLimit = this.zus.getContributionBasisWithinLimit(actualContributionBasis)

    const pensionContribution = this.zus.gePensionContribution(contributionBasisWithnLimit)
    const disabilityContribution = this.zus.geDisabilityContribution(contributionBasisWithnLimit)

    if(this.getInputData().isSickContribution) {
      sickContribution = this.zus.getSickContribution(actualContributionBasis)
    }
    if(this.getInputData().isFpContribution) {
      fpContribution = this.zus.getFPContribution(actualContributionBasis)
      fsContribution = this.zus.getFSContribution(actualContributionBasis)
    }
    if (this.getInputData().accidentContributionRate) {
      accidentContribution = this.zus.getAccidentContribution(actualContributionBasis, this.getInputData().accidentContributionRate)
    }

    this.result = {
      contributionBasis: actualContributionBasis,
      accidentContribution,
      sickContribution,
      pensionContribution,
      disabilityContribution,
      fpContribution,
      fsContribution,
    }

    return this
  }

  public getDaysInMonth(monthIndex:number) {
    const settingStore = useSettingStore()
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if (monthIndex === 1) {
      const currentYear = settingStore.dateOfLawRules.getFullYear()

      // Check if it's a leap year (divisible by 4, but not divisible by 100 unless divisible by 400)
      if ((currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0)) {
        return 29 // Leap year, February has 29 days
      } else {
        return 28 // Non-leap year, February has 28 days
      }
    }

    return daysInMonth[monthIndex]
  }
}
