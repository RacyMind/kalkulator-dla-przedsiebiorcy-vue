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
    <FormSection title="Stopień niepełnosprawności">
      <div class="row">
        <div class="col-12">
          <q-select
            v-model="disabilityDegree"
            :options="disabilityDegreeOptions"
            emit-value
            map-options
            label="Stopień niepełnosprawności"
            color="brand"
            required
          />
        </div>
      </div>
    </FormSection>
    <FormSection title="Podstawa wymiaru składek społecznych">
      <div class="row q-col-gutter-x-md q-mb-sm">
        <div class="col-12 col-sm">
          <ZusContributionBasisSelect v-model="chosenContributionBasis" />
        </div>
        <div class="col-12 col-sm">
          <q-input
            v-model.number="contributionBasis"
            :disable="chosenContributionBasis !== ContributionBasises.Custom"
            type="number"
            min="0"
            step="0.01"
            label="Podstawa wymiaru składek"
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
      </div>
      <div class="text-caption text-on-surface">
        Refundacja PFRON obejmuje obowiązkowe składki emerytalną i rentową.
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { DisabilityDegree } from 'components/pfronRefund/types/DisabilityDegree'
import { InputFields } from 'components/pfronRefund/interfaces/InputFields'
import {
  ContributionBasises,
  useContributionBasis,
} from 'src/composables/contributionBasises'
import { useConstantsStore } from 'stores/constantsStore'
import { useFormValidation } from 'src/composables/formValidation'
import { useLawRuleDate } from 'src/composables/lawRuleDate'
import { useLocalStorage } from '@vueuse/core'
import { usePfronRefundStore } from 'components/pfronRefund/store'
import { useSettingStore } from 'stores/settingStore'
import { watch } from 'vue'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import ZusContributionBasisSelect from 'components/selfEmployment/components/ZusContributionBasisSelect.vue'
import validationRules from 'src/logic/validationRules'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()
const { handleValidationError } = useFormValidation()
const { availableDates } = useLawRuleDate()
const { zusConstants } = storeToRefs(useConstantsStore())
const store = usePfronRefundStore()
const settingStore = useSettingStore()

const disabilityDegreeOptions = [
  {
    label: 'Znaczny (100%)',
    value: DisabilityDegree.Significant,
  },
  {
    label: 'Umiarkowany (60%)',
    value: DisabilityDegree.Moderate,
  },
  {
    label: 'Lekki (30%)',
    value: DisabilityDegree.Light,
  },
]

const disabilityDegree = useLocalStorage<DisabilityDegree>(
  'pfronRefund/form/disabilityDegree',
  DisabilityDegree.Moderate,
  { mergeDefaults: true },
)
const { chosenContributionBasis } = useContributionBasis('pfronRefund/form')
const contributionBasis = useLocalStorage(
  'pfronRefund/form/contributionBasis',
  zusConstants.value.entrepreneur.basises.big,
  { mergeDefaults: true },
)

const setPresetContributionBasis = () => {
  switch (chosenContributionBasis.value) {
    case ContributionBasises.Big:
      contributionBasis.value = zusConstants.value.entrepreneur.basises.big
      break
    case ContributionBasises.Small:
      contributionBasis.value = zusConstants.value.entrepreneur.basises.small()
      break
  }
}

setPresetContributionBasis()

watch(chosenContributionBasis, () => {
  setPresetContributionBasis()
})

watch(
  () => settingStore.dateOfLawRules,
  () => {
    setPresetContributionBasis()
  },
)

const handleFormSubmit = () => {
  const inputFields: InputFields = {
    disabilityDegree: disabilityDegree.value,
    contributionBasis: contributionBasis.value,
  }

  store.inputFields = inputFields
  incrementCalculationCount()
  emit('submit')
}
</script>
