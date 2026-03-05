import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'
import { getIkeLimit } from 'src/logic/ikeLimits'
import { getIkzeLimit, IkzeLimitStatus } from 'src/logic/ikzeLimits'
import helpers from 'src/logic/helpers'
import { useConstantsStore } from 'stores/constantsStore'
import { useSettingStore } from 'stores/settingStore'
import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import { Result } from 'components/savingsPlan/interfaces/Result'
import {
  ChartSeries,
  savingsPlanScenarioOrder,
  savingsPlanToolOrder,
  ScenarioProjection,
  ScenarioRates,
  SavingsPlanEmploymentForm,
  SavingsPlanScenario,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
  TimelinePoint,
  ToolProjection,
} from 'components/savingsPlan/types/SavingsPlanTypes'

interface SimulationResult {
  finalValue: number
  totalRequestedContributions: number
  totalEffectiveContributions: number
  totalTaxRelief: number
  totalBelkaTax: number
  totalIkzePayoutTax: number
  timeline: TimelinePoint[]
}

interface RequiredContributionResult {
  amount: number | null
  isTargetReachable: boolean
}

interface NetValueResult {
  netValue: number
  ikzePayoutTax: number
}

export class SavingsPlanCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
{
  protected readonly constantsStore
  protected readonly settingStore

  constructor() {
    super()
    this.constantsStore = useConstantsStore()
    this.settingStore = useSettingStore()
  }

  protected getHorizonMonths(input: InputFields): number {
    return Math.max(Math.round(input.horizonYears * 12), 1)
  }

  protected getScenarioRates(input: InputFields): ScenarioRates {
    return {
      [SavingsPlanScenario.Conservative]: input.conservativeReturnRate,
      [SavingsPlanScenario.Base]: input.baseReturnRate,
      [SavingsPlanScenario.Optimistic]: input.optimisticReturnRate,
    }
  }

  protected getAdjustedAnnualLimit(
    baseLimit: number,
    yearOffset: number,
    input: InputFields,
  ): number {
    const annualGrowthRate = input.annualLimitGrowthRate / 100
    const growthMultiplier = Math.pow(1 + annualGrowthRate, yearOffset)
    const adjustedLimit = helpers.round(baseLimit * growthMultiplier, 2)

    return Math.max(adjustedLimit, 0)
  }

  protected getIkzeLimitStatus(input: InputFields): IkzeLimitStatus {
    if (input.employmentForm === SavingsPlanEmploymentForm.SelfEmployment) {
      return IkzeLimitStatus.SelfEmployment
    }

    return IkzeLimitStatus.EmploymentContract
  }

  protected getAnnualContributionLimit(
    tool: SavingsPlanTool,
    input: InputFields,
    yearOffset: number,
  ): number | null {
    const startYear = this.settingStore.dateOfLawRules.getFullYear()
    const dateForLimit = new Date(startYear + yearOffset, 0, 1)

    if (tool === SavingsPlanTool.Ike) {
      const limit = getIkeLimit(dateForLimit)
      return this.getAdjustedAnnualLimit(limit, yearOffset, input)
    }

    if (tool === SavingsPlanTool.Ikze) {
      const limit = getIkzeLimit(dateForLimit, this.getIkzeLimitStatus(input))
      return this.getAdjustedAnnualLimit(limit, yearOffset, input)
    }

    return null
  }

  protected getMaximumMonthlyContributionForTool(
    tool: SavingsPlanTool,
    input: InputFields,
    horizonMonths: number,
  ): number | null {
    const yearsCount = Math.max(Math.ceil(horizonMonths / 12), 1)

    let maxAnnualLimit = 0

    for (let yearOffset = 0; yearOffset < yearsCount; yearOffset++) {
      const annualLimit = this.getAnnualContributionLimit(
        tool,
        input,
        yearOffset,
      )

      if (annualLimit !== null) {
        maxAnnualLimit = Math.max(maxAnnualLimit, annualLimit)
      }
    }

    if (maxAnnualLimit <= 0) {
      return null
    }

    return maxAnnualLimit / 12
  }

  protected getNetValue(
    tool: SavingsPlanTool,
    capital: number,
    totalTaxRelief: number,
  ): NetValueResult {
    if (tool === SavingsPlanTool.Ikze) {
      const ikzePayoutTax = capital > 0 ? capital * 0.1 : 0
      return {
        netValue: capital - ikzePayoutTax + totalTaxRelief,
        ikzePayoutTax,
      }
    }

    return {
      netValue: capital,
      ikzePayoutTax: 0,
    }
  }

  protected getIkzeTaxReliefRate(input: InputFields): number {
    const annualTaxBase = Math.max(input.annualTaxBase, 0)

    if (annualTaxBase <= 0) {
      return 0
    }

    if (
      input.employmentForm === SavingsPlanEmploymentForm.SelfEmployment &&
      input.taxationForm === SavingsPlanTaxationForm.FlatTax
    ) {
      return this.constantsStore.incomeTaxConstants.flatTax.taxRate
    }

    const taxScale = this.constantsStore.incomeTaxConstants.taxScale

    if (annualTaxBase <= taxScale.taxFreeAmount) {
      return 0
    }

    if (annualTaxBase <= taxScale.taxThreshold) {
      return taxScale.taxRates.first
    }

    return taxScale.taxRates.second
  }

  protected getTimelineLabel(month: number): string {
    if (month === 0) {
      return 'Start'
    }

    if (month % 12 === 0) {
      return `Rok ${month / 12}`
    }

    return `Miesiąc ${month}`
  }

  protected simulate(
    input: InputFields,
    tool: SavingsPlanTool,
    annualReturnRate: number,
    requestedMonthlyContribution: number,
    horizonMonths: number,
    includeTimeline: boolean,
  ): SimulationResult {
    const monthlyRate = annualReturnRate / 100 / 12
    const monthlyContribution = Math.max(requestedMonthlyContribution, 0)
    const ikzeTaxReliefRate = this.getIkzeTaxReliefRate(input)
    const belkaTaxRate = this.constantsStore.incomeTaxConstants.belkaTaxRate

    let capital = Math.max(input.initialCapital, 0)
    let totalRequestedContributions = 0
    let totalEffectiveContributions = 0
    let totalTaxRelief = 0
    let totalBelkaTax = 0

    let annualEffectiveContribution = 0
    let currentYearOffset = 0

    const timeline: TimelinePoint[] = []

    if (includeTimeline) {
      const initialNetValue = this.getNetValue(tool, capital, totalTaxRelief)
      timeline.push({
        month: 0,
        label: this.getTimelineLabel(0),
        value: helpers.round(initialNetValue.netValue, 2),
      })
    }

    for (let monthIndex = 0; monthIndex < horizonMonths; monthIndex++) {
      const yearOffset = Math.floor(monthIndex / 12)

      if (yearOffset !== currentYearOffset) {
        currentYearOffset = yearOffset
        annualEffectiveContribution = 0
      }

      const annualLimit = this.getAnnualContributionLimit(
        tool,
        input,
        yearOffset,
      )
      let effectiveMonthlyContribution = monthlyContribution

      if (annualLimit !== null) {
        const remainingAnnualLimit = Math.max(
          annualLimit - annualEffectiveContribution,
          0,
        )
        effectiveMonthlyContribution = Math.min(
          monthlyContribution,
          remainingAnnualLimit,
        )
        annualEffectiveContribution += effectiveMonthlyContribution
      }

      totalRequestedContributions += monthlyContribution
      totalEffectiveContributions += effectiveMonthlyContribution

      if (tool === SavingsPlanTool.NoRelief) {
        const interest = capital * monthlyRate
        const belkaTax = interest > 0 ? interest * belkaTaxRate : 0

        totalBelkaTax += belkaTax
        capital += interest - belkaTax + effectiveMonthlyContribution
      } else {
        capital += capital * monthlyRate + effectiveMonthlyContribution
      }

      if (tool === SavingsPlanTool.Ikze) {
        totalTaxRelief += effectiveMonthlyContribution * ikzeTaxReliefRate
      }

      const month = monthIndex + 1

      if (includeTimeline && (month % 12 === 0 || month === horizonMonths)) {
        const netValue = this.getNetValue(tool, capital, totalTaxRelief)
        timeline.push({
          month,
          label: this.getTimelineLabel(month),
          value: helpers.round(netValue.netValue, 2),
        })
      }
    }

    const netValue = this.getNetValue(tool, capital, totalTaxRelief)

    return {
      finalValue: helpers.round(netValue.netValue, 2),
      totalRequestedContributions: helpers.round(
        totalRequestedContributions,
        2,
      ),
      totalEffectiveContributions: helpers.round(
        totalEffectiveContributions,
        2,
      ),
      totalTaxRelief: helpers.round(totalTaxRelief, 2),
      totalBelkaTax: helpers.round(totalBelkaTax, 2),
      totalIkzePayoutTax: helpers.round(netValue.ikzePayoutTax, 2),
      timeline,
    }
  }

  protected getRequiredMonthlyContribution(
    input: InputFields,
    tool: SavingsPlanTool,
    annualReturnRate: number,
    horizonMonths: number,
  ): RequiredContributionResult {
    if (input.goalAmount <= 0) {
      return {
        amount: 0,
        isTargetReachable: true,
      }
    }

    const simulationForZeroContribution = this.simulate(
      input,
      tool,
      annualReturnRate,
      0,
      horizonMonths,
      false,
    )

    if (simulationForZeroContribution.finalValue >= input.goalAmount) {
      return {
        amount: 0,
        isTargetReachable: true,
      }
    }

    const maximumMonthlyContribution =
      this.getMaximumMonthlyContributionForTool(tool, input, horizonMonths)

    let lowerBound = 0
    let upperBound =
      maximumMonthlyContribution ??
      Math.max(input.monthlyContribution, input.goalAmount / horizonMonths, 100)

    let simulationForUpperBound = this.simulate(
      input,
      tool,
      annualReturnRate,
      upperBound,
      horizonMonths,
      false,
    )

    if (maximumMonthlyContribution === null) {
      while (
        simulationForUpperBound.finalValue < input.goalAmount &&
        upperBound < 5000000
      ) {
        upperBound *= 2

        simulationForUpperBound = this.simulate(
          input,
          tool,
          annualReturnRate,
          upperBound,
          horizonMonths,
          false,
        )
      }
    }

    if (simulationForUpperBound.finalValue < input.goalAmount) {
      return {
        amount: null,
        isTargetReachable: false,
      }
    }

    for (let index = 0; index < 60; index++) {
      const middle = (lowerBound + upperBound) / 2
      const simulationForMiddle = this.simulate(
        input,
        tool,
        annualReturnRate,
        middle,
        horizonMonths,
        false,
      )

      if (simulationForMiddle.finalValue >= input.goalAmount) {
        upperBound = middle
      } else {
        lowerBound = middle
      }
    }

    return {
      amount: helpers.round(upperBound, 2),
      isTargetReachable: true,
    }
  }

  protected buildToolProjection(
    input: InputFields,
    tool: SavingsPlanTool,
    scenarioRates: ScenarioRates,
    horizonMonths: number,
  ): ToolProjection {
    const annualLimit = this.getAnnualContributionLimit(tool, input, 0)
    const shouldBuildTimeline = input.activeTool === tool

    const scenarioProjections = savingsPlanScenarioOrder.map((scenario) => {
      const annualReturnRate = scenarioRates[scenario]
      const simulationResult = this.simulate(
        input,
        tool,
        annualReturnRate,
        input.monthlyContribution,
        horizonMonths,
        shouldBuildTimeline,
      )
      const requiredContribution = this.getRequiredMonthlyContribution(
        input,
        tool,
        annualReturnRate,
        horizonMonths,
      )
      const reachedGoal = simulationResult.finalValue >= input.goalAmount

      return {
        scenario,
        annualReturnRate,
        finalValue: simulationResult.finalValue,
        requiredMonthlyContribution: requiredContribution.amount,
        isTargetReachable: requiredContribution.isTargetReachable,
        reachedGoal,
        targetGap: helpers.round(
          Math.max(input.goalAmount - simulationResult.finalValue, 0),
          2,
        ),
        totalRequestedContributions:
          simulationResult.totalRequestedContributions,
        totalEffectiveContributions:
          simulationResult.totalEffectiveContributions,
        totalTaxRelief: simulationResult.totalTaxRelief,
        totalBelkaTax: simulationResult.totalBelkaTax,
        totalIkzePayoutTax: simulationResult.totalIkzePayoutTax,
        timeline: simulationResult.timeline,
      } as ScenarioProjection
    })

    return {
      tool,
      annualLimit,
      scenarioProjections,
    }
  }

  protected getChartSeries(
    toolProjection: ToolProjection | undefined,
  ): ChartSeries[] {
    return savingsPlanScenarioOrder.map((scenario) => {
      const scenarioProjection = toolProjection?.scenarioProjections.find(
        (projection) => projection.scenario === scenario,
      )

      return {
        scenario,
        values: scenarioProjection
          ? scenarioProjection.timeline.map((point) => point.value)
          : [],
      }
    })
  }

  public calculate(): this {
    const input = this.getInputData()
    const horizonMonths = this.getHorizonMonths(input)
    const scenarioRates = this.getScenarioRates(input)

    const toolProjections = savingsPlanToolOrder.map((tool) =>
      this.buildToolProjection(input, tool, scenarioRates, horizonMonths),
    )

    const activeToolProjection = toolProjections.find(
      (projection) => projection.tool === input.activeTool,
    )
    const baseScenarioProjection =
      activeToolProjection?.scenarioProjections.find(
        (projection) => projection.scenario === SavingsPlanScenario.Base,
      )

    this.result = {
      goalAmount: input.goalAmount,
      horizonMonths,
      monthlyContribution: input.monthlyContribution,
      activeTool: input.activeTool,
      annualLimitGrowthRate: input.annualLimitGrowthRate,
      chartLabels: baseScenarioProjection
        ? baseScenarioProjection.timeline.map((point) => point.label)
        : [],
      chartSeries: this.getChartSeries(activeToolProjection),
      toolProjections,
    }

    return this
  }
}
