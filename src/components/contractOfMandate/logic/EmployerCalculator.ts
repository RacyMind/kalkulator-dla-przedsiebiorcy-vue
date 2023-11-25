import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployerResult} from 'components/contractOfMandate/interfaces/EmployerResult'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import helpers from 'src/logic/helpers'

export class EmployerCalculator extends BasicCalculator<InputFields, EmployerResult> implements Calculator<InputFields, EmployerResult>
{
  protected readonly zusContribution: EmployerZusContribution
  protected sumUpContributionBasis = 0
  protected isPartOfAnnualResult = false

  constructor(isPartOfAnnualResult = false) {
    super()
    this.isPartOfAnnualResult = isPartOfAnnualResult
    this.zusContribution = new EmployerZusContribution()
  }

  calculate(): this {
    let pensionContribution = 0
    let disabilityContribution = 0
    let accidentContribution = 0
    let ppkContribution = 0
    let fpContribution = 0
    let fgspContribution = 0
    let fsContribution = 0

    const contributionBasis = this.zusContribution.getContributionBasis(this.getInputData().grossAmount, this.sumUpContributionBasis)

    if (this.getInputData().isPensionContribution) {
      pensionContribution = this.zusContribution.gePensionContribution(contributionBasis)
    }
    if (this.getInputData().isDisabilityContribution) {
      disabilityContribution = this.zusContribution.geDisabilityContribution(contributionBasis)
    }
    if (this.getInputData().accidentContributionRate) {
      accidentContribution = this.zusContribution.getAccidentContribution(this.getInputData().grossAmount, this.getInputData().accidentContributionRate)
    }
    if (this.getInputData().employerPpkContributionRate) {
      ppkContribution = this.zusContribution.getPPKContribution(this.getInputData().grossAmount, this.getInputData().employerPpkContributionRate)
    }
    if(this.getInputData().isFpContribution) {
      fpContribution = this.zusContribution.getFPContribution(this.getInputData().grossAmount)
      fgspContribution = this.zusContribution.getFGSPContribution(this.getInputData().grossAmount)
      fsContribution = this.zusContribution.getFSContribution(this.getInputData().grossAmount)
    }

    const totalAmount = helpers.round(this.getInputData().grossAmount + accidentContribution + fsContribution + fgspContribution + ppkContribution + fpContribution
     + disabilityContribution + pensionContribution, 2)

    this.sumUpContributionBasis = helpers.round(this.sumUpContributionBasis + contributionBasis, 2)

    this.result = {
      grossAmount: this.getInputData().grossAmount,
      disabilityContribution,
      pensionContribution,
      ppkContribution,
      fpContribution,
      fsContribution,
      fgspContribution,
      accidentContribution,
      totalAmount,
    }

    return this
  }

}
