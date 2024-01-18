<template>
  <div>
    <div class="row">
      <div class="col">
        <q-toggle
          v-model="isPpkContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka na Pracownicze Plany Kapitałowe"
        />
      </div>
    </div>
    <div
      v-if="isPpkContribution"
      class="row q-col-gutter-sm">
      <div class="col">
        <q-input
          v-model.number="employerPpkContributionRate"
          type="number"
          class="full-width"
          :min="zusConstants.employer.rates.ppkContribution.min * 100"
          :max="zusConstants.employer.rates.ppkContribution.max * 100"
          step="0.01"
          label="Pracodawca"
          color="brand"
          suffix="%"
          :rules="[
            val => !!val || '* Wpisz wartość',
          ]"
          lazy-rules="ondemand"
        />
      </div>
      <div class="col">
        <q-input
          v-model.number="employeePpkContributionRate"
          type="number"
          class="full-width"
          :min="zusConstants.employee.rates.ppkContribution.min * 100"
          :max="zusConstants.employee.rates.ppkContribution.max * 100"
          step="0.01"
          label="Pracownik"
          color="brand"
          suffix="%"
          :rules="[
            val => !!val || '* Wpisz wartość',
          ]"
          lazy-rules="ondemand"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useConstants} from 'src/composables/constants'

interface Props {
  isPpkContribution: boolean
  employerPpkContributionRate: number
  employeePpkContributionRate: number
}
const props = defineProps<Props>()
const emit = defineEmits([
  'update:isPpkContribution',
  'update:employerPpkContributionRate',
  'update:employeePpkContributionRate',
])

const { zusConstants } = useConstants()

const isPpkContribution = computed({
  get() {
    return props.isPpkContribution
  },
  set(value) {
    emit('update:isPpkContribution', value)
  },
})

const employerPpkContributionRate = computed({
  get() {
    return props.employerPpkContributionRate
  },
  set(value) {
    emit('update:employerPpkContributionRate', value)
  },
})

const employeePpkContributionRate = computed({
  get() {
    return props.employeePpkContributionRate
  },
  set(value) {
    emit('update:employeePpkContributionRate', value)
  },
})
</script>
