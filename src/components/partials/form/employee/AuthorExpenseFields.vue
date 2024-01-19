<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-toggle
          v-model="areAuthorExpenses"
          checked-icon="check"
          unchecked-icon="clear"
          label="Autorskie koszty uzyskania przychodu (50%)"
        />
      </div>
    </div>
    <div
      v-if="areAuthorExpenses"
      class="row q-col-gutter-md">
      <div class="col">
        <q-input
          v-model.number="partOfWorkWithAuthorExpenses"
          type="number"
          min="0"
          max="100"
          step="1"
          label="Część pracy*"
          color="brand"
          suffix="%"
          :rules="[
            val => !!val || '* Wpisz wartość',
          ]"
          lazy-rules="ondemand"
        />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-toggle
          v-if="areAuthorExpenses"
          v-model="hasPercentageForEachMonth"
          checked-icon="check"
          unchecked-icon="clear"
          label="Różne wartości procentowe w poszczególnych miesiącach"
        />
      </div>
    </div>
    <EachMonthPercentageFields
      v-if="areAuthorExpenses && hasPercentageForEachMonth"
      v-model="monthlyValues"
    />
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import EachMonthPercentageFields from 'components/partials/form/EachMonthPercentageFields.vue'

interface Props {
  areAuthorExpenses: boolean
  partOfWorkWithAuthorExpenses: number
  hasPercentageForEachMonth: boolean
  monthlyValues: number[]
}
const props = defineProps<Props>()
const emit = defineEmits(['update:areAuthorExpenses', 'update:hasPercentageForEachMonth', 'update:partOfWorkWithAuthorExpenses', 'update:monthlyValues'])

const areAuthorExpenses = computed({
  get() {
    return props.areAuthorExpenses
  },
  set(value) {
    emit('update:areAuthorExpenses', value)
  },
})

const hasPercentageForEachMonth = computed({
  get() {
    return props.hasPercentageForEachMonth
  },
  set(value) {
    emit('update:hasPercentageForEachMonth', value)
  },
})

const partOfWorkWithAuthorExpenses = computed({
  get() {
    return props.partOfWorkWithAuthorExpenses
  },
  set(value) {
    emit('update:partOfWorkWithAuthorExpenses', value)
  },
})

const monthlyValues = computed({
  get() {
    return props.monthlyValues
  },
  set(value) {
    emit('update:monthlyValues', value)
  },
})
</script>
