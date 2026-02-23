import { createPinia, setActivePinia } from 'pinia'
import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import { Result } from 'components/savingsPlan/interfaces/Result'
import { SavingsPlanCalculator } from 'components/savingsPlan/logic/SavingsPlanCalculator'
import {
  SavingsPlanEmploymentForm,
  SavingsPlanScenario,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { useSettingStore } from 'stores/settingStore'
import { beforeEach, describe, expect, it } from 'vitest'

setActivePinia(createPinia())

const getResult = (input: InputFields): Result => {
  return new SavingsPlanCalculator().setInputData(input).calculate().getResult()
}

const getBaseInput = (): InputFields => ({
  goalAmount: 10000,
  horizonYears: 1,
  monthlyContribution: 3000,
  initialCapital: 0,
  conservativeReturnRate: 0,
  baseReturnRate: 0,
  optimisticReturnRate: 0,
  employmentForm: SavingsPlanEmploymentForm.EmploymentContract,
  taxationForm: SavingsPlanTaxationForm.TaxScale,
  annualTaxBase: 90000,
  annualLimitGrowthRate: 0,
  activeTool: SavingsPlanTool.Ikze,
})

const getScenarioProjection = (
  result: Result,
  tool: SavingsPlanTool,
  scenario: SavingsPlanScenario,
) => {
  const toolProjection = result.toolProjections.find(
    (projection) => projection.tool === tool,
  )

  if (!toolProjection) {
    throw new Error(`Missing projection for tool: ${tool}`)
  }

  const scenarioProjection = toolProjection.scenarioProjections.find(
    (projection) => projection.scenario === scenario,
  )

  if (!scenarioProjection) {
    throw new Error(`Missing projection for scenario: ${scenario}`)
  }

  return scenarioProjection
}

describe('SavingsPlanCalculator on 1.01.2026', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('throws for invalid data flow', () => {
    expect(() => new SavingsPlanCalculator().getResult()).toThrowError(
      'undefined',
    )
    expect(() =>
      new SavingsPlanCalculator().calculate().getResult(),
    ).toThrowError('undefined')
  })

  it('applies yearly limits and 12% IKZE relief for employment contract tax scale', () => {
    const result = getResult(getBaseInput())

    expect(result.goalAmount).toBe(10000)
    expect(result.horizonMonths).toBe(12)
    expect(result.monthlyContribution).toBe(3000)
    expect(result.activeTool).toBe(SavingsPlanTool.Ikze)
    expect(result.chartLabels).toEqual(['Start', 'Rok 1'])
    expect(result.chartSeries).toHaveLength(3)
    expect(result.toolProjections).toHaveLength(3)

    const ikzeBase = getScenarioProjection(
      result,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )

    expect(ikzeBase.annualReturnRate).toBe(0)
    expect(ikzeBase.finalValue).toBe(11530.08)
    expect(ikzeBase.requiredMonthlyContribution).toBe(816.99)
    expect(ikzeBase.isTargetReachable).toBe(true)
    expect(ikzeBase.reachedGoal).toBe(true)
    expect(ikzeBase.targetGap).toBe(0)
    expect(ikzeBase.totalRequestedContributions).toBe(36000)
    expect(ikzeBase.totalEffectiveContributions).toBe(11304)
    expect(ikzeBase.totalTaxRelief).toBe(1356.48)
    expect(ikzeBase.totalBelkaTax).toBe(0)
    expect(ikzeBase.totalIkzePayoutTax).toBe(1130.4)
    expect(ikzeBase.timeline).toEqual([
      {
        month: 0,
        label: 'Start',
        value: 0,
      },
      {
        month: 12,
        label: 'Rok 1',
        value: 11530.08,
      },
    ])

    const ikeBase = getScenarioProjection(
      result,
      SavingsPlanTool.Ike,
      SavingsPlanScenario.Base,
    )
    const noReliefBase = getScenarioProjection(
      result,
      SavingsPlanTool.NoRelief,
      SavingsPlanScenario.Base,
    )

    expect(ikeBase.finalValue).toBe(28308)
    expect(ikeBase.requiredMonthlyContribution).toBe(833.33)
    expect(ikeBase.totalTaxRelief).toBe(0)
    expect(noReliefBase.finalValue).toBe(36000)
    expect(noReliefBase.totalBelkaTax).toBe(0)
  })

  it('uses second tax scale rate for IKZE when annual tax base crosses threshold', () => {
    const lowerThresholdInput = getBaseInput()
    const higherThresholdInput = {
      ...getBaseInput(),
      annualTaxBase: 200000,
    }

    const lowerThresholdResult = getResult(lowerThresholdInput)
    const higherThresholdResult = getResult(higherThresholdInput)
    const lowerThresholdIkze = getScenarioProjection(
      lowerThresholdResult,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )
    const higherThresholdIkze = getScenarioProjection(
      higherThresholdResult,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )

    expect(lowerThresholdIkze.totalTaxRelief).toBe(1356.48)
    expect(higherThresholdIkze.totalTaxRelief).toBe(3617.28)
    expect(higherThresholdIkze.finalValue).toBe(13790.88)
    expect(higherThresholdIkze.finalValue).toBeGreaterThan(
      lowerThresholdIkze.finalValue,
    )
  })

  it('uses flat 19% IKZE relief for self-employment with flat tax', () => {
    const lowBaseInput = {
      ...getBaseInput(),
      employmentForm: SavingsPlanEmploymentForm.SelfEmployment,
      taxationForm: SavingsPlanTaxationForm.FlatTax,
      annualTaxBase: 20000,
    }
    const highBaseInput = {
      ...lowBaseInput,
      annualTaxBase: 300000,
    }

    const lowBaseResult = getResult(lowBaseInput)
    const highBaseResult = getResult(highBaseInput)
    const lowBaseIkze = getScenarioProjection(
      lowBaseResult,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )
    const highBaseIkze = getScenarioProjection(
      highBaseResult,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )

    expect(lowBaseIkze.totalEffectiveContributions).toBe(16956)
    expect(highBaseIkze.totalEffectiveContributions).toBe(16956)
    expect(lowBaseIkze.totalTaxRelief).toBe(3221.64)
    expect(highBaseIkze.totalTaxRelief).toBe(3221.64)
  })

  it('applies yearly limit growth to IKE and IKZE contributions', () => {
    const noGrowthInput = {
      ...getBaseInput(),
      horizonYears: 2,
      annualLimitGrowthRate: 0,
    }
    const growthInput = {
      ...noGrowthInput,
      annualLimitGrowthRate: 10,
    }

    const noGrowthResult = getResult(noGrowthInput)
    const growthResult = getResult(growthInput)

    const noGrowthIke = getScenarioProjection(
      noGrowthResult,
      SavingsPlanTool.Ike,
      SavingsPlanScenario.Base,
    )
    const growthIke = getScenarioProjection(
      growthResult,
      SavingsPlanTool.Ike,
      SavingsPlanScenario.Base,
    )
    const noGrowthIkze = getScenarioProjection(
      noGrowthResult,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )
    const growthIkze = getScenarioProjection(
      growthResult,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )

    expect(noGrowthIke.totalEffectiveContributions).toBe(56616)
    expect(growthIke.totalEffectiveContributions).toBe(59446.8)
    expect(noGrowthIkze.totalEffectiveContributions).toBe(22608)
    expect(growthIkze.totalEffectiveContributions).toBe(23738.4)
    expect(growthResult.annualLimitGrowthRate).toBe(10)
  })

  it('marks target unreachable for limited tools and reachable for no-relief tool', () => {
    const input: InputFields = {
      ...getBaseInput(),
      goalAmount: 100000,
      monthlyContribution: 1000,
      activeTool: SavingsPlanTool.Ike,
    }

    const result = getResult(input)

    const ikeBase = getScenarioProjection(
      result,
      SavingsPlanTool.Ike,
      SavingsPlanScenario.Base,
    )
    const ikzeBase = getScenarioProjection(
      result,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )
    const noReliefBase = getScenarioProjection(
      result,
      SavingsPlanTool.NoRelief,
      SavingsPlanScenario.Base,
    )

    expect(ikeBase.requiredMonthlyContribution).toBe(null)
    expect(ikeBase.isTargetReachable).toBe(false)
    expect(ikzeBase.requiredMonthlyContribution).toBe(null)
    expect(ikzeBase.isTargetReachable).toBe(false)
    expect(noReliefBase.requiredMonthlyContribution).toBe(8333.33)
    expect(noReliefBase.isTargetReachable).toBe(true)
  })

  it('compares net outcomes for tools in positive-return scenario', () => {
    const input: InputFields = {
      ...getBaseInput(),
      goalAmount: 50000,
      horizonYears: 5,
      monthlyContribution: 700,
      initialCapital: 5000,
      conservativeReturnRate: 3,
      baseReturnRate: 6,
      optimisticReturnRate: 9,
      employmentForm: SavingsPlanEmploymentForm.SelfEmployment,
      taxationForm: SavingsPlanTaxationForm.FlatTax,
      annualTaxBase: 200000,
      activeTool: SavingsPlanTool.NoRelief,
    }

    const result = getResult(input)
    const ikeBase = getScenarioProjection(
      result,
      SavingsPlanTool.Ike,
      SavingsPlanScenario.Base,
    )
    const ikzeBase = getScenarioProjection(
      result,
      SavingsPlanTool.Ikze,
      SavingsPlanScenario.Base,
    )
    const noReliefBase = getScenarioProjection(
      result,
      SavingsPlanTool.NoRelief,
      SavingsPlanScenario.Base,
    )

    expect(result.activeTool).toBe(SavingsPlanTool.NoRelief)
    expect(result.chartLabels.length).toBeGreaterThan(2)
    expect(result.chartSeries).toHaveLength(3)
    expect(result.chartSeries[0]?.values.length).toBe(result.chartLabels.length)
    expect(result.chartSeries[1]?.values.length).toBe(result.chartLabels.length)
    expect(result.chartSeries[2]?.values.length).toBe(result.chartLabels.length)

    expect(ikeBase.totalBelkaTax).toBe(0)
    expect(noReliefBase.totalBelkaTax).toBeGreaterThan(0)
    expect(ikzeBase.totalTaxRelief).toBeGreaterThan(0)
    expect(ikzeBase.totalIkzePayoutTax).toBeGreaterThan(0)
    expect(ikzeBase.finalValue).toBeGreaterThan(noReliefBase.finalValue)
    expect(ikeBase.finalValue).toBeGreaterThan(noReliefBase.finalValue)
    expect(ikeBase.requiredMonthlyContribution).not.toBe(null)
    expect(ikzeBase.requiredMonthlyContribution).not.toBe(null)
    expect(noReliefBase.requiredMonthlyContribution).not.toBe(null)
  })
})
