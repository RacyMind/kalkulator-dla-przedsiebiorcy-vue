<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="save">
    <FormSection title="Data rozpoczęcia">
      <q-input
        v-model="startDate"
        color="brand"
        mask="##.##.####"
        label="Data rozpoczęcia działalności"
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
        hide-bottom-space
        aria-required="true">
        <template v-slot:append>
          <q-icon
            :name="matEvent"
            class="cursor-pointer">
          </q-icon>
        </template>
        <DatePopup v-model="startDate" />
      </q-input>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {ref} from 'vue'
import {format, parse} from 'date-fns'
import {useFormValidation} from 'src/composables/formValidation'
import DatePopup from 'components/partials/DatePopup.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import validationRules from 'src/logic/validationRules'
import {matEvent} from 'src/icons'

const emit = defineEmits<{
  save: [input: VatLimitInputFields]
}>()

const {handleValidationError} = useFormValidation()
const startDate = ref(format(new Date(), 'dd.MM.yyyy'))

const save = () => {
  const input: VatLimitInputFields = {
    startDate: parse(
      startDate.value,
      'dd.MM.yyyy',
      new Date(),
    ),
  }
  emit('save', input)
}
</script>
