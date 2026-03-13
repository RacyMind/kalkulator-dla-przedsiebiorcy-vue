export enum SavingsPlanScenario {
  Conservative = 'conservative',
  Base = 'base',
  Optimistic = 'optimistic',
}

export enum SavingsPlanTool {
  Ike = 'ike',
  Ikze = 'ikze',
  NoRelief = 'no_relief',
}

export enum SavingsPlanEmploymentForm {
  EmploymentContract = 'employment_contract',
  SelfEmployment = 'self_employment',
}

export enum SavingsPlanTaxationForm {
  TaxScale = 'tax_scale',
  FlatTax = 'flat_tax',
}

export const savingsPlanScenarioOrder = [
  SavingsPlanScenario.Conservative,
  SavingsPlanScenario.Base,
  SavingsPlanScenario.Optimistic,
]

export const savingsPlanToolOrder = [
  SavingsPlanTool.Ike,
  SavingsPlanTool.Ikze,
  SavingsPlanTool.NoRelief,
]

export type ScenarioRates = Record<SavingsPlanScenario, number>

export interface SavingsPlanSavedPlanPayload {
  goalAmount: number
  horizonYears: number
  monthlyContribution: number
  initialCapital: number
  conservativeReturnRate: number
  baseReturnRate: number
  optimisticReturnRate: number
  employmentForm: SavingsPlanEmploymentForm
  taxationForm: SavingsPlanTaxationForm
  annualTaxBase: number
  annualLimitGrowthRate: number
  activeTool: SavingsPlanTool
}

export interface SavingsPlanSavedPlan {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  payload: SavingsPlanSavedPlanPayload
}

export interface SavingsPlanStorageSchema {
  version: number
  activePlanId: string | null
  savedPlans: SavingsPlanSavedPlan[]
}

export interface TimelinePoint {
  month: number
  label: string
  value: number
}

export interface ScenarioProjection {
  scenario: SavingsPlanScenario
  annualReturnRate: number
  finalValue: number
  requiredMonthlyContribution: number | null
  isTargetReachable: boolean
  reachedGoal: boolean
  targetGap: number
  totalRequestedContributions: number
  totalEffectiveContributions: number
  totalTaxRelief: number
  totalBelkaTax: number
  totalIkzePayoutTax: number
  timeline: TimelinePoint[]
}

export interface ToolProjection {
  tool: SavingsPlanTool
  annualLimit: number | null
  scenarioProjections: ScenarioProjection[]
}

export interface ChartSeries {
  scenario: SavingsPlanScenario
  values: number[]
}

export function getSavingsPlanScenarioLabel(
  scenario: SavingsPlanScenario,
): string {
  switch (scenario) {
    case SavingsPlanScenario.Conservative:
      return 'Konserwatywny'
    case SavingsPlanScenario.Base:
      return 'Bazowy'
    case SavingsPlanScenario.Optimistic:
      return 'Optymistyczny'
    default:
      return scenario
  }
}

export function getSavingsPlanToolLabel(tool: SavingsPlanTool): string {
  switch (tool) {
    case SavingsPlanTool.Ike:
      return 'IKE'
    case SavingsPlanTool.Ikze:
      return 'IKZE'
    case SavingsPlanTool.NoRelief:
      return 'Bez ulg'
    default:
      return tool
  }
}

export function getSavingsPlanEmploymentFormLabel(
  form: SavingsPlanEmploymentForm,
): string {
  switch (form) {
    case SavingsPlanEmploymentForm.EmploymentContract:
      return 'Umowa o pracę'
    case SavingsPlanEmploymentForm.SelfEmployment:
      return 'Działalność gospodarcza'
    default:
      return form
  }
}

export function getSavingsPlanTaxationFormLabel(
  form: SavingsPlanTaxationForm,
): string {
  switch (form) {
    case SavingsPlanTaxationForm.TaxScale:
      return 'Skala podatkowa'
    case SavingsPlanTaxationForm.FlatTax:
      return 'Podatek liniowy'
    default:
      return form
  }
}
