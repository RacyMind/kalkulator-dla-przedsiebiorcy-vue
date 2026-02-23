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
            clearable
            label="Wybierz zapisany plan"
            color="brand"
            hide-bottom-space
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            type="button"
            color="primary"
            class="full-width"
            label="Zapisz"
            @click="handleSavePlan"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            type="button"
            color="secondary"
            class="full-width"
            label="Wczytaj"
            :disable="!hasSelectedSavedPlan"
            @click="handleLoadPlan"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            type="button"
            color="accent"
            class="full-width"
            label="Nadpisz"
            :disable="!hasSelectedSavedPlan"
            @click="handleOverwritePlan"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-btn
            type="button"
            color="negative"
            class="full-width"
            label="Usuń"
            :disable="!hasSelectedSavedPlan"
            @click="handleDeletePlan"
          />
        </div>
      </div>
    </FormSection>

    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
    label: `${savedPlan.name} (${new Date(savedPlan.updatedAt).toLocaleString('pl-PL')})`,
    value: savedPlan.id,
  })),
)

const hasSelectedSavedPlan = computed(() => selectedSavedPlanId.value !== null)

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

const handleSavePlan = () => {
  const planId = store.savePlan(savedPlanName.value, getInputFields())
  selectedSavedPlanId.value = planId
  savedPlanName.value = ''
}

const handleOverwritePlan = () => {
  if (selectedSavedPlanId.value === null) {
    return
  }

  const overwrittenPlanId = store.overwritePlan(
    selectedSavedPlanId.value,
    savedPlanName.value,
    getInputFields(),
  )

  if (overwrittenPlanId !== null) {
    selectedSavedPlanId.value = overwrittenPlanId
    savedPlanName.value = ''
  }
}

const handleLoadPlan = () => {
  if (selectedSavedPlanId.value === null) {
    return
  }

  const loadedPlan = store.loadPlan(selectedSavedPlanId.value)

  if (loadedPlan === undefined) {
    return
  }

  applyInputFields(loadedPlan)
  emit('submit')
}

const handleDeletePlan = () => {
  if (selectedSavedPlanId.value === null) {
    return
  }

  store.deletePlan(selectedSavedPlanId.value)
  selectedSavedPlanId.value = null
  savedPlanName.value = ''
}

const handleFormSubmit = () => {
  store.setInputFields(getInputFields())
  incrementCalculationCount()
  emit('submit')
}
</script>
