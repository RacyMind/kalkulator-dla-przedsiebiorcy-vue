import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import {
  SavingsPlanEmploymentForm,
  SavingsPlanSavedPlan,
  SavingsPlanSavedPlanPayload,
  SavingsPlanStorageSchema,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'

type LegacyPayload = Partial<SavingsPlanSavedPlanPayload> & {
  chartTool?: string
  ikzeLimitStatus?: string
}

type PartialSavedPlan = Partial<SavingsPlanSavedPlan> & {
  inputFields?: unknown
}

export const savingsPlanStorageKey = 'savingsPlan/savedPlans'
export const savingsPlanStorageVersion = 1
export const maxSavedPlans = 30

export const defaultSavingsPlanInputFields: InputFields = {
  goalAmount: 200000,
  horizonYears: 15,
  monthlyContribution: 1000,
  initialCapital: 0,
  conservativeReturnRate: 4,
  baseReturnRate: 6,
  optimisticReturnRate: 8,
  employmentForm: SavingsPlanEmploymentForm.EmploymentContract,
  taxationForm: SavingsPlanTaxationForm.TaxScale,
  annualTaxBase: 90000,
  annualLimitGrowthRate: 0,
  activeTool: SavingsPlanTool.Ike,
}

const savingsPlanToolValues = Object.values(SavingsPlanTool)
const savingsPlanEmploymentFormValues = Object.values(SavingsPlanEmploymentForm)
const savingsPlanTaxationFormValues = Object.values(SavingsPlanTaxationForm)

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

function toFiniteNumber(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback
  }

  return value
}

function getNormalizedTool(value: unknown): SavingsPlanTool {
  if (savingsPlanToolValues.includes(value as SavingsPlanTool)) {
    return value as SavingsPlanTool
  }

  if (value === 'deposit') {
    return SavingsPlanTool.NoRelief
  }

  return defaultSavingsPlanInputFields.activeTool
}

function getNormalizedEmploymentForm(
  payload: LegacyPayload,
): SavingsPlanEmploymentForm {
  if (
    savingsPlanEmploymentFormValues.includes(
      payload.employmentForm as SavingsPlanEmploymentForm,
    )
  ) {
    return payload.employmentForm as SavingsPlanEmploymentForm
  }

  if (payload.ikzeLimitStatus === SavingsPlanEmploymentForm.SelfEmployment) {
    return SavingsPlanEmploymentForm.SelfEmployment
  }

  return defaultSavingsPlanInputFields.employmentForm
}

function getNormalizedTaxationForm(
  payload: LegacyPayload,
): SavingsPlanTaxationForm {
  if (
    savingsPlanTaxationFormValues.includes(
      payload.taxationForm as SavingsPlanTaxationForm,
    )
  ) {
    return payload.taxationForm as SavingsPlanTaxationForm
  }

  return defaultSavingsPlanInputFields.taxationForm
}

export function normalizeSavingsPlanPayload(payload: unknown): InputFields {
  const source: LegacyPayload =
    payload !== null && typeof payload === 'object'
      ? (payload as LegacyPayload)
      : {}
  const employmentForm = getNormalizedEmploymentForm(source)

  return {
    goalAmount: Math.max(
      toFiniteNumber(
        source.goalAmount,
        defaultSavingsPlanInputFields.goalAmount,
      ),
      0,
    ),
    horizonYears: Math.max(
      toFiniteNumber(
        source.horizonYears,
        defaultSavingsPlanInputFields.horizonYears,
      ),
      1,
    ),
    monthlyContribution: Math.max(
      toFiniteNumber(
        source.monthlyContribution,
        defaultSavingsPlanInputFields.monthlyContribution,
      ),
      0,
    ),
    initialCapital: Math.max(
      toFiniteNumber(
        source.initialCapital,
        defaultSavingsPlanInputFields.initialCapital,
      ),
      0,
    ),
    conservativeReturnRate: toFiniteNumber(
      source.conservativeReturnRate,
      defaultSavingsPlanInputFields.conservativeReturnRate,
    ),
    baseReturnRate: toFiniteNumber(
      source.baseReturnRate,
      defaultSavingsPlanInputFields.baseReturnRate,
    ),
    optimisticReturnRate: toFiniteNumber(
      source.optimisticReturnRate,
      defaultSavingsPlanInputFields.optimisticReturnRate,
    ),
    employmentForm,
    taxationForm: getNormalizedTaxationForm(source),
    annualTaxBase: Math.max(
      toFiniteNumber(
        source.annualTaxBase,
        defaultSavingsPlanInputFields.annualTaxBase,
      ),
      0,
    ),
    annualLimitGrowthRate: Math.max(
      toFiniteNumber(
        source.annualLimitGrowthRate,
        defaultSavingsPlanInputFields.annualLimitGrowthRate,
      ),
      -99,
    ),
    activeTool: getNormalizedTool(source.activeTool ?? source.chartTool),
  }
}

export function createSavedPlanId(): string {
  return `savings-plan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function normalizeSavedPlan(item: unknown): SavingsPlanSavedPlan | null {
  if (item === null || typeof item !== 'object') {
    return null
  }

  const source = item as PartialSavedPlan
  const now = new Date().toISOString()

  return {
    id:
      typeof source.id === 'string' && source.id.length > 0
        ? source.id
        : createSavedPlanId(),
    name:
      typeof source.name === 'string' && source.name.trim().length > 0
        ? source.name.trim()
        : 'Plan oszczędzania',
    createdAt:
      typeof source.createdAt === 'string' && source.createdAt.length > 0
        ? source.createdAt
        : now,
    updatedAt:
      typeof source.updatedAt === 'string' && source.updatedAt.length > 0
        ? source.updatedAt
        : now,
    payload: normalizeSavingsPlanPayload(source.payload ?? source.inputFields),
  }
}

function normalizeSavedPlans(plans: unknown[]): SavingsPlanSavedPlan[] {
  const normalizedPlans = plans
    .map(normalizeSavedPlan)
    .filter((item): item is SavingsPlanSavedPlan => item !== null)

  return normalizedPlans.slice(0, maxSavedPlans)
}

function getEmptyStorageSchema(): SavingsPlanStorageSchema {
  return {
    version: savingsPlanStorageVersion,
    activePlanId: null,
    savedPlans: [],
  }
}

export function readSavingsPlanStorage(): SavingsPlanStorageSchema {
  const storage = getStorage()

  if (storage === null) {
    return getEmptyStorageSchema()
  }

  const rawStorage = storage.getItem(savingsPlanStorageKey)

  if (rawStorage === null) {
    return getEmptyStorageSchema()
  }

  try {
    const parsedStorage = JSON.parse(rawStorage) as unknown

    if (Array.isArray(parsedStorage)) {
      return {
        version: savingsPlanStorageVersion,
        activePlanId: null,
        savedPlans: normalizeSavedPlans(parsedStorage),
      }
    }

    if (parsedStorage === null || typeof parsedStorage !== 'object') {
      return getEmptyStorageSchema()
    }

    const source = parsedStorage as Partial<SavingsPlanStorageSchema>
    const savedPlans = normalizeSavedPlans(
      Array.isArray(source.savedPlans) ? source.savedPlans : [],
    )
    const activePlanExists = savedPlans.some(
      (savedPlan) => savedPlan.id === source.activePlanId,
    )

    return {
      version: savingsPlanStorageVersion,
      activePlanId:
        activePlanExists && typeof source.activePlanId === 'string'
          ? source.activePlanId
          : null,
      savedPlans,
    }
  } catch {
    return getEmptyStorageSchema()
  }
}

export function writeSavingsPlanStorage(
  schema: SavingsPlanStorageSchema,
): void {
  const storage = getStorage()

  if (storage === null) {
    return
  }

  storage.setItem(
    savingsPlanStorageKey,
    JSON.stringify({
      version: savingsPlanStorageVersion,
      activePlanId: schema.activePlanId,
      savedPlans: schema.savedPlans.slice(0, maxSavedPlans),
    }),
  )
}
