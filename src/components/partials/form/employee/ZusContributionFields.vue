<template>
  <div>
    <div class="row items-center q-col-gutter-sm">
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isHealthContribution"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
          label="Składka zdrowotna"
        />
      </div>
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isDisabilityContribution"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
          label="Składka rentowa"
        />
      </div>
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isPensionContribution"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
          label="Składka emerytalna"
        />
      </div>
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isSickContribution"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
          label="Składka chorobowa"
        />
      </div>
      <div
        v-if="!props.hideEmployerContributions"
        class="col-6 col-sm-auto">
        <q-toggle
          v-model="isFpContribution"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
          label="Składka na Fundusz Pracy"
        />
      </div>
      <div
        v-if="!props.hideEmployerContributions"
        class="col-6 col-sm-auto">
        <q-toggle
          v-model="isFgspContribution"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
          label="Składka na FGŚP"
        />
      </div>
    </div>
    <div
      v-if="!props.hideEmployerContributions"
      class="row q-mb-md">
      <div class="col">
        <q-input
          v-model.number="accidentContributionRate"
          type="number"
          min="0"
          step="0.01"
          label="Składka wypadkowa*"
          color="brand"
          suffix="%"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {matCheck, matClear} from 'src/icons'

const isHealthContribution = defineModel<boolean>('isHealthContribution', {required: true})
const isDisabilityContribution = defineModel<boolean>('isDisabilityContribution', {required: true})
const isPensionContribution = defineModel<boolean>('isPensionContribution', {required: true})
const isSickContribution = defineModel<boolean>('isSickContribution', {required: true})
const isFpContribution = defineModel<boolean>('isFpContribution', {required: false, default: false})
const isFgspContribution = defineModel<boolean>('isFgspContribution', {required: false, default: false})
const accidentContributionRate = defineModel<number>('accidentContributionRate', {required: false, default: 0})

interface Props {
  hideEmployerContributions?:boolean
}
const props = withDefaults(defineProps<Props>(), {
  hideEmployerContributions: false,
})
</script>
