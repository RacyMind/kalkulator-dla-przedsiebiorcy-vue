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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  areAuthorExpenses: boolean
  partOfWorkWithAuthorExpenses: number
}
const props = defineProps<Props>()
const emit = defineEmits(['update:areAuthorExpenses', 'update:partOfWorkWithAuthorExpenses'])

const areAuthorExpenses = computed({
  get() {
    return props.areAuthorExpenses
  },
  set(value) {
    emit('update:areAuthorExpenses', value)
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
</script>
