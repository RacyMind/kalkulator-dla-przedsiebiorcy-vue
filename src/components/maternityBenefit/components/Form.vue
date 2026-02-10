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
    <FormSection title="Forma zatrudnienia">
      <div class="row">
        <div class="col-12">
          <q-select
            v-model="employmentType"
            :options="employmentTypeOptions"
            label="Forma zatrudnienia"
            color="brand"
            emit-value
            map-options
          />
        </div>
      </div>
      <div v-if="employmentType === EmploymentType.SelfEmployment" class="row">
        <div class="col-12">
          <q-select
            v-model="zusType"
            :options="zusTypeOptions"
            label="Typ składek ZUS"
            color="brand"
            emit-value
            map-options
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Podstawa wymiaru">
      <div class="row">
        <div class="col-12">
          <q-input
            v-model.number="averageBasis"
            type="number"
            min="0"
            step="0.01"
            suffix="zł"
            :label="basisLabel"
            color="brand"
            :rules="basisRules"
            :disable="isBasisDisabled"
            hide-bottom-space
            lazy-rules="ondemand"
            aria-required="true"
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Liczba dzieci" hide-separator>
      <div class="row">
        <div class="col-12">
          <q-select
            v-model="childrenCount"
            :options="childrenCountOptions"
            label="Liczba dzieci urodzonych w jednym porodzie"
            color="brand"
            emit-value
            map-options
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useConstantsStore } from 'stores/constantsStore'
import { useFormValidation } from 'src/composables/formValidation'
import { useLawRuleDate } from 'src/composables/lawRuleDate'
import { useLocalStorage } from '@vueuse/core'
import { useMaternityBenefitStore } from 'components/maternityBenefit/store'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'
import {
  ChildrenCount,
  EmploymentType,
  ZusType,
} from 'components/maternityBenefit/types'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()
const { handleValidationError } = useFormValidation()
const { availableDates } = useLawRuleDate()
const { zusConstants, wageStats } = storeToRefs(useConstantsStore())
const store = useMaternityBenefitStore()

const employmentTypeOptions = [
  { label: 'Umowa o pracę', value: EmploymentType.EmploymentContract },
  { label: 'Działalność gospodarcza', value: EmploymentType.SelfEmployment },
]

const zusTypeOptions = [
  { label: 'Duży ZUS', value: ZusType.Big },
  { label: 'ZUS preferencyjny', value: ZusType.Preferential },
  { label: 'Inny', value: ZusType.Custom },
]

const childrenCountOptions = [
  { label: '1', value: 1 as ChildrenCount },
  { label: '2', value: 2 as ChildrenCount },
  { label: '3', value: 3 as ChildrenCount },
  { label: '4', value: 4 as ChildrenCount },
  { label: '5+', value: 5 as ChildrenCount },
]

const employmentType = useLocalStorage<EmploymentType>(
  'maternityBenefit/form/employmentType',
  EmploymentType.EmploymentContract,
  { mergeDefaults: true },
)
const zusType = useLocalStorage<ZusType>(
  'maternityBenefit/form/zusType',
  ZusType.Big,
  { mergeDefaults: true },
)
const averageBasis = useLocalStorage(
  'maternityBenefit/form/averageBasis',
  wageStats.value.minimumWage(),
  { mergeDefaults: true },
)
const childrenCount = useLocalStorage<ChildrenCount>(
  'maternityBenefit/form/childrenCount',
  1,
  { mergeDefaults: true },
)

const isBasisDisabled = computed(() => {
  return (
    employmentType.value === EmploymentType.SelfEmployment &&
    zusType.value !== ZusType.Custom
  )
})

const basisLabel = computed(() => {
  if (employmentType.value === EmploymentType.EmploymentContract) {
    return 'Średnie miesięczne wynagrodzenie brutto'
  }
  return 'Podstawa składki chorobowej'
})

const maxBasis = computed(() => {
  return Math.round(2.5 * wageStats.value.projectedAverageWage() * 100) / 100
})

const basisRules = computed(() => {
  const rules: Array<(val: any) => string | boolean> = [
    validationRules.requiredAmount,
    validationRules.greaterThan(0),
  ]
  if (
    employmentType.value === EmploymentType.SelfEmployment &&
    zusType.value === ZusType.Custom
  ) {
    rules.push(validationRules.maxValue(maxBasis.value))
  }
  return rules
})

watch([employmentType, zusType], () => {
  if (employmentType.value === EmploymentType.SelfEmployment) {
    if (zusType.value === ZusType.Big) {
      averageBasis.value = zusConstants.value.entrepreneur.basises.big
    } else if (zusType.value === ZusType.Preferential) {
      averageBasis.value = zusConstants.value.entrepreneur.basises.small()
    }
  }
})

const handleFormSubmit = () => {
  if (!averageBasis.value) {
    return
  }

  store.inputFields = {
    employmentType: employmentType.value,
    zusType: zusType.value,
    averageBasis: averageBasis.value,
    childrenCount: childrenCount.value,
  }

  incrementCalculationCount()
  emit('submit')
}
</script>
