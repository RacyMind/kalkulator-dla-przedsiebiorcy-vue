import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSavingsPlanStore } from 'components/savingsPlan/store'
import {
  SavingsPlanEmploymentForm,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'

describe('SavingsPlan storage migration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('migrates legacy payload with chartTool and ikzeLimitStatus to new schema', () => {
    localStorage.setItem(
      'savingsPlan/savedPlans',
      JSON.stringify({
        version: 0,
        activePlanId: 'legacy-plan',
        savedPlans: [
          {
            id: 'legacy-plan',
            name: 'Stary plan',
            payload: {
              goalAmount: 120000,
              horizonYears: 12,
              monthlyContribution: 800,
              initialCapital: 1000,
              conservativeReturnRate: 2,
              baseReturnRate: 5,
              optimisticReturnRate: 7,
              chartTool: 'deposit',
              ikzeLimitStatus: 'self_employment',
            },
          },
        ],
      }),
    )

    const store = useSavingsPlanStore()
    const migratedPayload = store.savedPlans[0]?.payload

    expect(migratedPayload).toBeDefined()
    expect(migratedPayload?.activeTool).toBe(SavingsPlanTool.NoRelief)
    expect(migratedPayload?.employmentForm).toBe(
      SavingsPlanEmploymentForm.SelfEmployment,
    )
    expect(migratedPayload?.taxationForm).toBe(SavingsPlanTaxationForm.TaxScale)
    expect(migratedPayload?.annualTaxBase).toBe(90000)
    expect(migratedPayload?.annualLimitGrowthRate).toBe(0)
    expect(store.activePlanId).toBe('legacy-plan')
  })

  it('saves, loads, overwrites and deletes plans in local storage state', () => {
    const store = useSavingsPlanStore()
    const basePayload = {
      goalAmount: 200000,
      horizonYears: 20,
      monthlyContribution: 1200,
      initialCapital: 5000,
      conservativeReturnRate: 3,
      baseReturnRate: 6,
      optimisticReturnRate: 9,
      employmentForm: SavingsPlanEmploymentForm.EmploymentContract,
      taxationForm: SavingsPlanTaxationForm.TaxScale,
      annualTaxBase: 95000,
      annualLimitGrowthRate: 1.5,
      activeTool: SavingsPlanTool.Ike,
    }

    const planId = store.savePlan('Mój plan', basePayload)
    const loadedPayload = store.loadPlan(planId)

    expect(store.savedPlans).toHaveLength(1)
    expect(loadedPayload).toEqual(basePayload)

    const overwriteResult = store.overwritePlan(planId, 'Plan po zmianie', {
      ...basePayload,
      goalAmount: 250000,
      activeTool: SavingsPlanTool.Ikze,
    })

    expect(overwriteResult).toBe(planId)
    expect(store.savedPlans[0]?.name).toBe('Plan po zmianie')
    expect(store.savedPlans[0]?.payload.goalAmount).toBe(250000)
    expect(store.savedPlans[0]?.payload.activeTool).toBe(SavingsPlanTool.Ikze)

    store.deletePlan(planId)

    expect(store.savedPlans).toHaveLength(0)
    expect(store.activePlanId).toBe(null)
  })
})
