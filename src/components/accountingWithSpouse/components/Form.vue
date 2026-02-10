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
    <SpouseForm ref="husbandForm" :spouse="Spouse.Husband" />
    <SpouseForm ref="wifeForm" :spouse="Spouse.Wife" />
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'

import { Ref, ref } from 'vue'
import { Spouse } from 'components/accountingWithSpouse/logic/Spouse'
import { useFormValidation } from 'src/composables/formValidation'
import { useLawRuleDate } from 'src/composables/lawRuleDate'
import SpouseForm from 'components/accountingWithSpouse/components/SpouseForm.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import { useReviewPrompt } from 'src/composables/useReviewPrompt'

const emit = defineEmits(['submit'])

const { incrementCalculationCount } = useReviewPrompt()

const { handleValidationError } = useFormValidation()

const { availableDates } = useLawRuleDate()
const husbandForm: Ref<InstanceType<typeof SpouseForm>> = ref(null)
const wifeForm: Ref<InstanceType<typeof SpouseForm>> = ref(null)

const handleFormSubmit = () => {
  husbandForm.value.handleSaveData()
  wifeForm.value.handleSaveData()

  incrementCalculationCount()
  emit('submit')
}
</script>
