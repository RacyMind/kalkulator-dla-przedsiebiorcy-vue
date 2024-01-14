<template>
  <div>
    <div class="row items-center q-col-gutter-sm">
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isHealthContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka zdrowotna"
        />
      </div>
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isDisabilityContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka rentowa"
        />
      </div>
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isPensionContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka emerytalna"
        />
      </div>
      <div class="col-6 col-sm-3">
        <q-toggle
          v-model="isSickContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka chorobowa"
        />
      </div>
      <div class="col-6 col-sm-auto">
        <q-toggle
          v-model="isFpContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka na Fundusz Pracy"
        />
      </div>
      <div class="col-6 col-sm-auto">
        <q-toggle
          v-model="isFgspContribution"
          checked-icon="check"
          unchecked-icon="clear"
          label="Składka na FGŚP"
        />
      </div>
    </div>
    <div class="row q-mb-md">
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

import {computed} from 'vue'

interface Props {
  isHealthContribution: boolean
  isDisabilityContribution: boolean
  isPensionContribution: boolean
  isSickContribution: boolean
  isFpContribution: boolean
  isFgspContribution: boolean
  accidentContributionRate: boolean
}
const props = defineProps<Props>()
const emit = defineEmits([
  'update:isHealthContribution',
  'update:isDisabilityContribution',
  'update:isPensionContribution',
  'update:isSickContribution',
  'update:isFpContribution',
  'update:isFgspContribution',
  'update:accidentContributionRate',
])

const isHealthContribution = computed({
  get() {
    return props.isHealthContribution
  },
  set(value) {
    emit('update:isHealthContribution', value)
  },
})

const isDisabilityContribution = computed({
  get() {
    return props.isDisabilityContribution
  },
  set(value) {
    emit('update:isDisabilityContribution', value)
  },
})

const isPensionContribution = computed({
  get() {
    return props.isPensionContribution
  },
  set(value) {
    emit('update:isPensionContribution', value)
  },
})

const isSickContribution = computed({
  get() {
    return props.isSickContribution
  },
  set(value) {
    emit('update:isSickContribution', value)
  },
})

const isFpContribution = computed({
  get() {
    return props.isFpContribution
  },
  set(value) {
    emit('update:isFpContribution', value)
  },
})

const isFgspContribution = computed({
  get() {
    return props.isFgspContribution
  },
  set(value) {
    emit('update:isFgspContribution', value)
  },
})

const accidentContributionRate = computed({
  get() {
    return props.accidentContributionRate
  },
  set(value) {
    emit('update:accidentContributionRate', value)
  },
})
</script>
