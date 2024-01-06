<template>
  <q-form @submit.prevent="save">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          suffix="zł"
          label="Podstawa wymiaru świadczenia*"
          autofocus
          color="brand"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model.number="holidayHours"
          type="number"
          min="1"
          step="1"
          label="Liczba godzin urlopu*"
          color="brand"
          :rules="[validationRules.required]"
          lazy-rules
        />
      </div>
    </div>
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="dailyNorm"
          type="number"
          min="0"
          step="0.01"
          suffix="godzin"
          label="Obowiązująca norma dobowa*"
          autofocus
          color="brand"
          :rules="[validationRules.required]"
          lazy-rules
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model.number="workingTime"
          type="number"
          min="0"
          max="100"
          step="0.01"
          suffix="% etatu"
          label="Wymiar czasu pracy*"
          :rules="[validationRules.required]"
          lazy-rules
        />
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import {AvailableYear} from 'src/types/AvailableYear'
import {SalaryForUnusedHolidaysFields} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysFields'
import {computed, ref} from 'vue'
import validationRules from 'src/logic/validationRules'

type Props = {
  year: AvailableYear,
}

const props = defineProps<Props>()

const emit = defineEmits(['save'])

const amount = ref(null)
const holidayHours = ref(null)
const dailyNorm = ref(8)
const workingTime = ref(100)

const isDisabledButton = computed(() => {
  return !amount.value || !holidayHours.value || !dailyNorm.value || !workingTime.value
})

const save = () => {
  const input: SalaryForUnusedHolidaysFields = {
    year: props.year,
    amount: Number(amount.value),
    dailyNorm: Number(dailyNorm.value),
    holidayHours: Number(holidayHours.value),
    workingTime: Number(workingTime.value) / 100,
  }
  emit('save', input)
}
</script>
