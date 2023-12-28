<template>
  <div>
    <q-radio
      v-model="amountType"
      :val="AmountTypes.Net"
      label="netto"
    />
    <q-radio
      v-model="amountType"
      :val="AmountTypes.Gross"
      label="brutto"
    />
  </div>
</template>

<script setup lang="ts">
import {AmountTypes} from 'src/composables/constants'
import {computed} from 'vue'

interface Props {
  modelValue: AmountTypes
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const amountType = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
