import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'
import { DisabilityDegree } from 'components/pfronRefund/types/DisabilityDegree'
import { InputFields } from 'components/pfronRefund/interfaces/InputFields'
import { Result } from 'components/pfronRefund/interfaces/Result'
import { EntrepreneurZusContribution } from 'src/logic/zus/EntrepreneurZusContribution'
import helpers from 'src/logic/helpers'

export const PFRON_REFUND_RATE_BY_DEGREE: Record<DisabilityDegree, number> = {
  [DisabilityDegree.Significant]: 1,
  [DisabilityDegree.Moderate]: 0.6,
  [DisabilityDegree.Light]: 0.3,
}

export class PfronRefundCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
{
  public calculate(): this {
    const input = this.getInputData()
    const refundRate = PFRON_REFUND_RATE_BY_DEGREE[input.disabilityDegree]
    const zus = new EntrepreneurZusContribution()

    if (refundRate === undefined) {
      throw new Error(
        `Unsupported disability degree: ${input.disabilityDegree}`,
      )
    }

    const contributionBasis = Math.max(
      helpers.round(input.contributionBasis, 2),
      0,
    )
    const contributionBasisWithinLimit =
      zus.getContributionBasisWithinLimit(contributionBasis)
    const pensionContribution = zus.gePensionContribution(
      contributionBasisWithinLimit,
    )
    const disabilityContribution = zus.geDisabilityContribution(
      contributionBasisWithinLimit,
    )
    const socialContributionsAmount = helpers.round(
      pensionContribution + disabilityContribution,
      2,
    )
    const refundAmount = helpers.round(
      socialContributionsAmount * refundRate,
      2,
    )
    const entrepreneurCostAfterRefund = helpers.round(
      socialContributionsAmount - refundAmount,
      2,
    )

    this.result = {
      disabilityDegree: input.disabilityDegree,
      pensionContribution,
      disabilityContribution,
      socialContributionsAmount,
      refundRate,
      refundAmount,
      entrepreneurCostAfterRefund,
    }

    return this
  }
}
