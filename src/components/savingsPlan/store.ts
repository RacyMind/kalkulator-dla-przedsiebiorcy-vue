import { acceptHMRUpdate, defineStore } from 'pinia'
import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import { SavingsPlanCalculator } from 'components/savingsPlan/logic/SavingsPlanCalculator'
import {
  createSavedPlanId,
  maxSavedPlans,
  normalizeSavingsPlanPayload,
  readSavingsPlanStorage,
  savingsPlanStorageVersion,
  writeSavingsPlanStorage,
} from 'components/savingsPlan/logic/SavingsPlanStorage'
import {
  SavingsPlanSavedPlan,
  SavingsPlanStorageSchema,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'

type Store = {
  inputFields: InputFields | undefined
  savedPlans: SavingsPlanSavedPlan[]
  activePlanId: string | null
}

export const useSavingsPlanStore = defineStore('savingsPlanStore', {
  state: (): Store => {
    const storageState = readSavingsPlanStorage()

    return {
      inputFields: undefined,
      savedPlans: storageState.savedPlans,
      activePlanId: storageState.activePlanId,
    }
  },
  getters: {
    result(state) {
      if (state.inputFields === undefined) {
        return undefined
      }

      return new SavingsPlanCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
  actions: {
    setInputFields(inputFields: InputFields) {
      this.inputFields = normalizeSavingsPlanPayload(inputFields)
    },
    setActiveTool(activeTool: SavingsPlanTool) {
      if (this.inputFields === undefined) {
        return
      }

      this.inputFields = {
        ...this.inputFields,
        activeTool,
      }
    },
    savePlan(name: string, payload: InputFields): string {
      const normalizedPayload = normalizeSavingsPlanPayload(payload)
      const now = new Date().toISOString()
      const planName =
        name.trim().length > 0
          ? name.trim()
          : `Plan oszczędzania ${this.savedPlans.length + 1}`
      const savedPlan: SavingsPlanSavedPlan = {
        id: createSavedPlanId(),
        name: planName,
        createdAt: now,
        updatedAt: now,
        payload: normalizedPayload,
      }

      this.savedPlans = [savedPlan, ...this.savedPlans].slice(0, maxSavedPlans)
      this.activePlanId = savedPlan.id
      this.inputFields = normalizedPayload
      this.persistSavedPlans()

      return savedPlan.id
    },
    overwritePlan(
      planId: string,
      name: string,
      payload: InputFields,
    ): string | null {
      const planIndex = this.savedPlans.findIndex(
        (savedPlan) => savedPlan.id === planId,
      )

      if (planIndex < 0) {
        return null
      }

      const normalizedPayload = normalizeSavingsPlanPayload(payload)
      const now = new Date().toISOString()
      const existingPlan = this.savedPlans[planIndex] as SavingsPlanSavedPlan
      const nextName = name.trim().length > 0 ? name.trim() : existingPlan.name
      const nextPlan: SavingsPlanSavedPlan = {
        ...existingPlan,
        name: nextName,
        updatedAt: now,
        payload: normalizedPayload,
      }

      this.savedPlans.splice(planIndex, 1)
      this.savedPlans = [nextPlan, ...this.savedPlans].slice(0, maxSavedPlans)
      this.activePlanId = nextPlan.id
      this.inputFields = normalizedPayload
      this.persistSavedPlans()

      return nextPlan.id
    },
    loadPlan(planId: string): InputFields | undefined {
      const savedPlan = this.savedPlans.find((plan) => plan.id === planId)

      if (savedPlan === undefined) {
        return undefined
      }

      const payload = normalizeSavingsPlanPayload(savedPlan.payload)

      this.activePlanId = savedPlan.id
      this.inputFields = payload
      this.persistSavedPlans()

      return payload
    },
    deletePlan(planId: string): void {
      this.savedPlans = this.savedPlans.filter((plan) => plan.id !== planId)

      if (this.activePlanId === planId) {
        this.activePlanId = null
      }

      this.persistSavedPlans()
    },
    persistSavedPlans() {
      const storageSchema: SavingsPlanStorageSchema = {
        version: savingsPlanStorageVersion,
        activePlanId: this.activePlanId,
        savedPlans: this.savedPlans,
      }

      writeSavingsPlanStorage(storageSchema)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSavingsPlanStore, import.meta.hot))
}
