<template>
  <q-form @submit.prevent="handleFormSubmit">
    <FormSection title="Dane demograficzne">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="currentAge"
            type="number"
            min="18"
            max="100"
            label="Aktualny wiek"
            suffix="lat"
            color="brand"
            :rules="[validationRules.required, validationRules.minValue(18), validationRules.maxValue(100)]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="withdrawalAge"
            type="number"
            min="19"
            max="100"
            label="Wiek rozpoczęcia wypłat"
            suffix="lat"
            color="brand"
            :rules="[validationRules.required, validationRules.greaterThan(currentAge), validationRules.maxValue(100)]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
      </div>
    </FormSection>

    <FormSection title="Wpłaty">
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-12">
          <q-select
            v-model="contributionType"
            :options="contributionTypeOptions"
            emit-value
            map-options
            color="brand"
            label="Rodzaj wpłaty"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="contributionAmount"
            type="number"
            min="0"
            step="1"
            :label="contributionType === ContributionType.Monthly ? 'Wpłata miesięczna' : 'Wpłata roczna'"
            suffix="zł"
            color="brand"
            :rules="[validationRules.requiredAmount, validationRules.minValue(0)]"
            lazy-rules="ondemand"
            hide-bottom-space
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

    <FormSection title="Parametry inwestycji">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="expectedReturnRate"
            type="number"
            min="-20"
            max="30"
            step="0.1"
            label="Oczekiwana stopa zwrotu"
            suffix="%"
            color="brand"
            :rules="[validationRules.required, validationRules.minValue(-20), validationRules.maxValue(30)]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model.number="withdrawalPeriod"
            type="number"
            min="1"
            max="50"
            label="Okres wypłat"
            suffix="lat"
            color="brand"
            :rules="[validationRules.required, validationRules.minValue(1), validationRules.maxValue(50)]"
            lazy-rules="ondemand"
            hide-bottom-space
          />
        </div>
      </div>
    </FormSection>

    <SubmitButton />
  </q-form>
</template>

<script setup lang="ts">
import { ContributionType } from '../types/ContributionType'
import { InputFields } from '../interfaces/InputFields'
import { useIkeSavingsStore } from '../store'
import { useLocalStorage } from '@vueuse/core'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import validationRules from 'src/logic/validationRules'

const emit = defineEmits(['submit'])
const store = useIkeSavingsStore()

const contributionTypeOptions = [
  { label: 'Miesięczna', value: ContributionType.Monthly },
  { label: 'Roczna', value: ContributionType.Yearly },
]

const currentAge = useLocalStorage('ikeSavings/form/currentAge', 30, { mergeDefaults: true })
const withdrawalAge = useLocalStorage('ikeSavings/form/withdrawalAge', 60, { mergeDefaults: true })
const contributionType = useLocalStorage<ContributionType>('ikeSavings/form/contributionType', ContributionType.Monthly, { mergeDefaults: true })
const contributionAmount = useLocalStorage('ikeSavings/form/contributionAmount', 500, { mergeDefaults: true })
const initialCapital = useLocalStorage('ikeSavings/form/initialCapital', 0, { mergeDefaults: true })
const expectedReturnRate = useLocalStorage('ikeSavings/form/expectedReturnRate', 5, { mergeDefaults: true })
const withdrawalPeriod = useLocalStorage('ikeSavings/form/withdrawalPeriod', 20, { mergeDefaults: true })

const handleFormSubmit = () => {
  const inputFields: InputFields = {
    currentAge: currentAge.value,
    contributionType: contributionType.value,
    contributionAmount: contributionAmount.value,
    expectedReturnRate: expectedReturnRate.value,
    withdrawalAge: withdrawalAge.value,
    withdrawalPeriod: withdrawalPeriod.value,
    initialCapital: initialCapital.value ?? 0,
  }

  store.inputFields = inputFields
  emit('submit')
}
</script>
