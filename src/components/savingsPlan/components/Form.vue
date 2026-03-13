<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit"
  >
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów"
    >
      <LawRuleDate />
    </FormSection>

    <FormSection title="Cel oszczędzania">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="goalAmount"
            type="number"
            min="0"
            step="100"
            label="Kwota celu"
            suffix="zł"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(0),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="horizonYears"
            type="number"
            min="1"
            max="60"
            step="1"
            label="Horyzont czasu"
            suffix="lat"
            color="brand"
            :rules="[
              validationRules.required,
              validationRules.minValue(1),
              validationRules.maxValue(60),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
      </div>
    </FormSection>

    <FormSection title="Wpłaty regularne">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="monthlyContribution"
            type="number"
            min="0"
            step="1"
            label="Miesięczna wpłata"
            suffix="zł"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(0),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="initialCapital"
            type="number"
            min="0"
            step="1"
            label="Kapitał początkowy"
            suffix="zł"
            color="brand"
            :rules="[validationRules.minValue(0)]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
      </div>
    </FormSection>

    <FormSection title="Scenariusze stopy zwrotu">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-4">
          <q-input
            v-model.number="conservativeReturnRate"
            type="number"
            min="-20"
            max="30"
            step="0.1"
            label="Konserwatywny"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.required,
              validationRules.minValue(-20),
              validationRules.maxValue(30),
              conservativeRateRule,
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input
            v-model.number="baseReturnRate"
            type="number"
            min="-20"
            max="30"
            step="0.1"
            label="Bazowy"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.required,
              validationRules.minValue(-20),
              validationRules.maxValue(30),
              baseRateMinRule,
              baseRateMaxRule,
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-sm-4">
          <q-input
            v-model.number="optimisticReturnRate"
            type="number"
            min="-20"
            max="30"
            step="0.1"
            label="Optymistyczny"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.required,
              validationRules.minValue(-20),
              validationRules.maxValue(30),
              optimisticRateRule,
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
      </div>
    </FormSection>

    <FormSection title="Parametry IKE i IKZE">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-sm-6">
          <q-select
            v-model="employmentForm"
            :options="employmentFormOptions"
            emit-value
            map-options
            label="Forma zatrudnienia"
            color="brand"
          />
        </div>
        <div v-if="isSelfEmployment" class="col-12 col-sm-6">
          <q-select
            v-model="taxationForm"
            :options="taxationFormOptions"
            emit-value
            map-options
            label="Forma opodatkowania"
            color="brand"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="annualTaxBase"
            type="number"
            min="0"
            step="100"
            label="Roczna podstawa opodatkowania"
            suffix="zł"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(0),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="annualLimitGrowthRate"
            type="number"
            min="-20"
            max="50"
            step="0.1"
            label="Roczny wzrost limitów IKE i IKZE"
            suffix="%"
            color="brand"
            :rules="[
              validationRules.requiredAmount,
              validationRules.minValue(-20),
              validationRules.maxValue(50),
            ]"
            lazy-rules="ondemand"
            hide-bottom-space
            aria-required="true"
          />
        </div>
      </div>
      <div class="text-caption q-mt-sm">
        Limit IKE ({{ lawRulesYear }}):
        <strong>{{ pln(currentIkeLimit) }}</strong> rocznie
      </div>
      <div class="text-caption">
        Limit IKZE ({{ lawRulesYear }}):
        <strong>{{ pln(currentIkzeLimit) }}</strong> rocznie
      </div>
      <div class="text-caption">
        Limity w kolejnych latach horyzontu są przeliczane składanie o podany
        procent.
      </div>
    </FormSection>

    <FormSection title="Zapisane plany">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="savedPlanName"
            label="Nazwa planu"
            color="brand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="selectedSavedPlanId"
            :options="savedPlanOptions"
            emit-value
            map-options
            label="Wybierz zapisany plan"
            color="brand"
            hide-bottom-space
            @update:model-value="handleSelectSavedPlan"
          />
        </div>
      </div>
      <div v-if="activeSavedPlanName" class="text-caption q-mb-sm">
        Aktywny plan:
        <strong>{{ activeSavedPlanName }}</strong>
      </div>
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-6 col-md-6">
          <q-btn
            type="button"
            color="primary"
            class="full-width"
            label="Zapisz"
            @click="handleSavePlan"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-6">
          <q-btn
            type="button"
            color="negative"
            class="full-width"
            label="Usuń"
            :disable="!hasSelectedSavedPlan"
            @click="openDeleteDialog"
          />
        </div>
      </div>
    </FormSection>

    <q-dialog v-model="isDeletePlanDialogOpen">
      <q-card class="q-pa-sm" style="max-width: 420px; width: 100%">
        <q-card-section class="text-h6">Usuń plan</q-card-section>
        <q-card-section class="q-pt-none">
          Czy na pewno chcesz usunąć aktywny plan
          <strong v-if="selectedSavedPlanName">
            "{{ selectedSavedPlanName }}"
          </strong>
          ?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Anuluj" />
          <q-btn color="negative" label="Usuń plan" @click="handleDeletePlan" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import { defaultSavingsPlanInputFields } from 'components/savingsPlan/logic/SavingsPlanStorage'
import {
  getSavingsPlanEmploymentFormLabel,
  getSavingsPlanTaxationFormLabel,
  SavingsPlanEmploymentForm,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { useSavingsPlanStore } from 'components/savingsPlan/store'
import { pln } from 'src/composables/currencyFormat'
import { useFormValidation } from 'src/composables/formValidation'
import { useLawRuleDate } from 'src/composables/lawRuleDate'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'
import { getIkeLimit } from 'src/logic/ikeLimits'
import { getIkzeLimit, IkzeLimitStatus } from 'src/logic/ikzeLimits'
import validationRules from 'src/logic/validationRules'
import { useSettingStore } from 'stores/settingStore'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()
const { handleValidationError } = useFormValidation()
const { availableDates } = useLawRuleDate()
const settingStore = useSettingStore()
const store = useSavingsPlanStore()

const employmentFormOptions = Object.values(SavingsPlanEmploymentForm).map(
  (form) => ({
    label: getSavingsPlanEmploymentFormLabel(form),
    value: form,
  }),
)

const taxationFormOptions = Object.values(SavingsPlanTaxationForm).map(
  (form) => ({
    label: getSavingsPlanTaxationFormLabel(form),
    value: form,
  }),
)

const goalAmount = useLocalStorage(
  'savingsPlan/form/goalAmount',
  defaultSavingsPlanInputFields.goalAmount,
  {
    mergeDefaults: true,
  },
)
const horizonYears = useLocalStorage(
  'savingsPlan/form/horizonYears',
  defaultSavingsPlanInputFields.horizonYears,
  {
    mergeDefaults: true,
  },
)
const monthlyContribution = useLocalStorage(
  'savingsPlan/form/monthlyContribution',
  defaultSavingsPlanInputFields.monthlyContribution,
  {
    mergeDefaults: true,
  },
)
const initialCapital = useLocalStorage(
  'savingsPlan/form/initialCapital',
  defaultSavingsPlanInputFields.initialCapital,
  {
    mergeDefaults: true,
  },
)
const conservativeReturnRate = useLocalStorage(
  'savingsPlan/form/conservativeReturnRate',
  defaultSavingsPlanInputFields.conservativeReturnRate,
  {
    mergeDefaults: true,
  },
)
const baseReturnRate = useLocalStorage(
  'savingsPlan/form/baseReturnRate',
  defaultSavingsPlanInputFields.baseReturnRate,
  {
    mergeDefaults: true,
  },
)
const optimisticReturnRate = useLocalStorage(
  'savingsPlan/form/optimisticReturnRate',
  defaultSavingsPlanInputFields.optimisticReturnRate,
  {
    mergeDefaults: true,
  },
)
const employmentForm = useLocalStorage<SavingsPlanEmploymentForm>(
  'savingsPlan/form/employmentForm',
  defaultSavingsPlanInputFields.employmentForm,
  {
    mergeDefaults: true,
  },
)
const taxationForm = useLocalStorage<SavingsPlanTaxationForm>(
  'savingsPlan/form/taxationForm',
  defaultSavingsPlanInputFields.taxationForm,
  {
    mergeDefaults: true,
  },
)
const annualTaxBase = useLocalStorage(
  'savingsPlan/form/annualTaxBase',
  defaultSavingsPlanInputFields.annualTaxBase,
  {
    mergeDefaults: true,
  },
)
const annualLimitGrowthRate = useLocalStorage(
  'savingsPlan/form/annualLimitGrowthRate',
  defaultSavingsPlanInputFields.annualLimitGrowthRate,
  {
    mergeDefaults: true,
  },
)
const activeTool = useLocalStorage<SavingsPlanTool>(
  'savingsPlan/form/activeTool',
  defaultSavingsPlanInputFields.activeTool,
  {
    mergeDefaults: true,
  },
)

const savedPlanName = ref('')
const selectedSavedPlanId = ref<string | null>(store.activePlanId)
const isDeletePlanDialogOpen = ref(false)

const isSelfEmployment = computed(
  () => employmentForm.value === SavingsPlanEmploymentForm.SelfEmployment,
)

const ikzeLimitStatus = computed(() => {
  if (isSelfEmployment.value) {
    return IkzeLimitStatus.SelfEmployment
  }

  return IkzeLimitStatus.EmploymentContract
})

const lawRulesYear = computed(() => settingStore.dateOfLawRules.getFullYear())
const currentIkeLimit = computed(() => getIkeLimit(settingStore.dateOfLawRules))
const currentIkzeLimit = computed(() =>
  getIkzeLimit(settingStore.dateOfLawRules, ikzeLimitStatus.value),
)

const savedPlanOptions = computed(() =>
  store.savedPlans.map((savedPlan) => ({
    label: savedPlan.name,
    value: savedPlan.id,
  })),
)

const hasSelectedSavedPlan = computed(() => selectedSavedPlanId.value !== null)

const activeSavedPlanName = computed(() => {
  const activePlan = store.savedPlans.find(
    (savedPlan) => savedPlan.id === store.activePlanId,
  )

  return activePlan?.name ?? null
})

const selectedSavedPlanName = computed(() => {
  if (selectedSavedPlanId.value === null) {
    return null
  }

  const selectedPlan = store.savedPlans.find(
    (savedPlan) => savedPlan.id === selectedSavedPlanId.value,
  )

  return selectedPlan?.name ?? null
})

const conservativeRateRule = (value: number): string | boolean => {
  if (value > baseReturnRate.value) {
    return 'Wariant konserwatywny nie może być wyższy od bazowego'
  }
  return true
}

const baseRateMinRule = (value: number): string | boolean => {
  if (value < conservativeReturnRate.value) {
    return 'Wariant bazowy nie może być niższy od konserwatywnego'
  }
  return true
}

const baseRateMaxRule = (value: number): string | boolean => {
  if (value > optimisticReturnRate.value) {
    return 'Wariant bazowy nie może być wyższy od optymistycznego'
  }
  return true
}

const optimisticRateRule = (value: number): string | boolean => {
  if (value < baseReturnRate.value) {
    return 'Wariant optymistyczny nie może być niższy od bazowego'
  }
  return true
}

const getInputFields = (): InputFields => ({
  goalAmount: goalAmount.value,
  horizonYears: horizonYears.value,
  monthlyContribution: monthlyContribution.value,
  initialCapital: initialCapital.value,
  conservativeReturnRate: conservativeReturnRate.value,
  baseReturnRate: baseReturnRate.value,
  optimisticReturnRate: optimisticReturnRate.value,
  employmentForm: employmentForm.value,
  taxationForm: taxationForm.value,
  annualTaxBase: annualTaxBase.value,
  annualLimitGrowthRate: annualLimitGrowthRate.value,
  activeTool: activeTool.value,
})

const applyInputFields = (inputFields: InputFields) => {
  goalAmount.value = inputFields.goalAmount
  horizonYears.value = inputFields.horizonYears
  monthlyContribution.value = inputFields.monthlyContribution
  initialCapital.value = inputFields.initialCapital
  conservativeReturnRate.value = inputFields.conservativeReturnRate
  baseReturnRate.value = inputFields.baseReturnRate
  optimisticReturnRate.value = inputFields.optimisticReturnRate
  employmentForm.value = inputFields.employmentForm
  taxationForm.value = inputFields.taxationForm
  annualTaxBase.value = inputFields.annualTaxBase
  annualLimitGrowthRate.value = inputFields.annualLimitGrowthRate
  activeTool.value = inputFields.activeTool
}

const getPlanById = (planId: string | null) => {
  if (planId === null) {
    return undefined
  }

  return store.savedPlans.find((savedPlan) => savedPlan.id === planId)
}

const handleSavePlan = () => {
  const activePlan = getPlanById(store.activePlanId)
  const trimmedName = savedPlanName.value.trim()

  const planId =
    activePlan !== undefined && trimmedName === activePlan.name
      ? store.overwritePlan(activePlan.id, activePlan.name, getInputFields())
      : store.savePlan(savedPlanName.value, getInputFields())

  if (planId === null) {
    return
  }

  selectedSavedPlanId.value = planId
  savedPlanName.value = getPlanById(planId)?.name ?? ''
}

const handleSelectSavedPlan = (planId: string | null) => {
  if (planId === null) {
    savedPlanName.value = ''
    return
  }

  const loadedPlan = store.loadPlan(planId)

  if (loadedPlan === undefined) {
    return
  }

  applyInputFields(loadedPlan)
  savedPlanName.value = getPlanById(planId)?.name ?? ''
  emit('submit')
}

const openDeleteDialog = () => {
  if (!hasSelectedSavedPlan.value) {
    return
  }

  isDeletePlanDialogOpen.value = true
}

const handleDeletePlan = () => {
  if (selectedSavedPlanId.value === null) {
    return
  }

  store.deletePlan(selectedSavedPlanId.value)
  selectedSavedPlanId.value = null
  savedPlanName.value = ''
  isDeletePlanDialogOpen.value = false
}

onMounted(() => {
  if (store.inputFields !== undefined || selectedSavedPlanId.value === null) {
    return
  }

  handleSelectSavedPlan(selectedSavedPlanId.value)
})

const handleFormSubmit = () => {
  store.setInputFields(getInputFields())
  incrementCalculationCount()
  emit('submit')
}
</script>
