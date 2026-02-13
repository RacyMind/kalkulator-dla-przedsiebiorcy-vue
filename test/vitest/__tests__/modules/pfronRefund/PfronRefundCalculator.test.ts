import { PfronRefundCalculator } from 'components/pfronRefund/logic/PfronRefundCalculator'
import { DisabilityDegree } from 'components/pfronRefund/types/DisabilityDegree'
import { InputFields } from 'components/pfronRefund/interfaces/InputFields'
import { Result } from 'components/pfronRefund/interfaces/Result'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingStore } from 'stores/settingStore'

const getResult = (input: InputFields): Result => {
  return new PfronRefundCalculator().setInputData(input).calculate().getResult()
}

describe('PfronRefundCalculator on 2026', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('The invalid data', () => {
    expect(() => new PfronRefundCalculator().getResult()).toThrowError(
      'undefined',
    )
    expect(() =>
      new PfronRefundCalculator().calculate().getResult(),
    ).toThrowError('undefined')
  })

  it('calculates 100% refund for significant disability degree and big ZUS basis in 2026', () => {
    const input: InputFields = {
      disabilityDegree: DisabilityDegree.Significant,
      contributionBasis: 5652,
    }

    const result = getResult(input)

    expect(result.disabilityDegree).toBe(DisabilityDegree.Significant)
    expect(result.pensionContribution).toBe(1103.27)
    expect(result.disabilityContribution).toBe(452.16)
    expect(result.socialContributionsAmount).toBe(1555.43)
    expect(result.refundRate).toBe(1)
    expect(result.refundAmount).toBe(1555.43)
    expect(result.entrepreneurCostAfterRefund).toBe(0)
  })

  it('calculates 60% refund for moderate disability degree', () => {
    const input: InputFields = {
      disabilityDegree: DisabilityDegree.Moderate,
      contributionBasis: 5652,
    }

    const result = getResult(input)

    expect(result.pensionContribution).toBe(1103.27)
    expect(result.disabilityContribution).toBe(452.16)
    expect(result.refundRate).toBe(0.6)
    expect(result.refundAmount).toBe(933.26)
    expect(result.entrepreneurCostAfterRefund).toBe(622.17)
  })

  it('calculates 30% refund for light disability degree', () => {
    const input: InputFields = {
      disabilityDegree: DisabilityDegree.Light,
      contributionBasis: 5652,
    }

    const result = getResult(input)

    expect(result.pensionContribution).toBe(1103.27)
    expect(result.disabilityContribution).toBe(452.16)
    expect(result.refundRate).toBe(0.3)
    expect(result.refundAmount).toBe(466.63)
    expect(result.entrepreneurCostAfterRefund).toBe(1088.8)
  })

  it('rounds values to two decimals', () => {
    const input: InputFields = {
      disabilityDegree: DisabilityDegree.Moderate,
      contributionBasis: 5652.129,
    }

    const result = getResult(input)

    expect(result.pensionContribution).toBe(1103.3)
    expect(result.disabilityContribution).toBe(452.17)
    expect(result.socialContributionsAmount).toBe(1555.47)
    expect(result.refundAmount).toBe(933.28)
    expect(result.entrepreneurCostAfterRefund).toBe(622.19)
  })

  it('normalizes negative contribution basis to zero', () => {
    const input: InputFields = {
      disabilityDegree: DisabilityDegree.Significant,
      contributionBasis: -100,
    }

    const result = getResult(input)

    expect(result.pensionContribution).toBe(0)
    expect(result.disabilityContribution).toBe(0)
    expect(result.socialContributionsAmount).toBe(0)
    expect(result.refundAmount).toBe(0)
    expect(result.entrepreneurCostAfterRefund).toBe(0)
  })

  it('throws error for unsupported disability degree', () => {
    const input = {
      disabilityDegree: 'unknown',
      contributionBasis: 5652,
    } as unknown as InputFields

    expect(() => getResult(input)).toThrowError('Unsupported disability degree')
  })
})
