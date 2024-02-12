<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="handleFormSubmit">
    <FormSection
      v-if="availableDates.length > 1"
      title="Data obowiązywania przepisów">
      <LawRuleDate />
    </FormSection>
    <FormSection title="Informacje o zatrudnieniu i urlopie">
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="amount"
            type="number"
            min="0"
            step="0.01"
            suffix="zł"
            label="Podstawa wymiaru świadczenia"
            color="brand"
            :rules="[validationRules.requiredAmount]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="holidayHours"
            type="number"
            min="1"
            step="1"
            label="Liczba godzin urlopu"
            color="brand"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="dailyNorm"
            type="number"
            min="0"
            step="0.01"
            suffix="godzin"
            label="Obowiązująca norma dobowa"
            color="brand"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="workingTime"
            type="number"
            min="0"
            max="100"
            step="0.01"
            suffix="% etatu"
            label="Wymiar czasu pracy"
            :rules="[validationRules.required]"
            lazy-rules="ondemand"
          />
        </div>
      </div>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import {useConstants} from 'src/composables/constants'
import {useFormValidation} from 'src/composables/formValidation'
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useLocalStorage} from '@vueuse/core'
import {useSalaryForUnusedHolidayStore} from 'components/salaryForUnusedHolidays/store'
import FormSection from 'components/partials/form/FormSection.vue'
import LawRuleDate from 'components/partials/LawRuleDate.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])

const {handleValidationError} = useFormValidation()
const { availableDates } = useLawRuleDate()
const store = useSalaryForUnusedHolidayStore()
const {wageStats} = useConstants()

const amount = useLocalStorage('salaryForUnusedHolidays/form/amount', wageStats.value.minimumWage, { mergeDefaults: true })
const holidayHours = useLocalStorage('salaryForUnusedHolidays/form/holidayHours', 8 * 20, { mergeDefaults: true })
const dailyNorm = useLocalStorage('salaryForUnusedHolidays/form/dailyNorm', 8, { mergeDefaults: true })
const workingTime = useLocalStorage('salaryForUnusedHolidays/form/workingTime', 100, { mergeDefaults: true })

const handleFormSubmit = () => {
  store.inputFields = {
    amount: amount.value,
    holidayHours: holidayHours.value,
    dailyNorm: dailyNorm.value,
    workingTime: helpers.round(workingTime.value / 100, 2),
  }

  emit('submit')
}
</script>
