import {BasicCalculator} from 'src/logic/BasicCalculator'
import {Calculator} from 'src/logic/interfaces/Calculator'
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
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

    const contributionBasis = this.zusContribution.getContributionBasisWithinLimit(this.getInputData().grossAmount, this.sumUpContributionBasis)

    const {
      pensionContribution,
      disabilityContribution,
      fpContribution,
      ppkContribution,
      fsContribution,
      fgspContribution,
      accidentContribution,
    } = this.zusContribution.getZusContributions(
      this.getInputData().grossAmount,
      contributionBasis,
      this.getInputData().isPensionContribution,
      this.getInputData().isDisabilityContribution,
      this.getInputData().isFpContribution,
      this.getInputData().isFgspContribution,
      this.getInputData().accidentContributionRate,
      this.getInputData().employerPpkContributionRate,
    )

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
