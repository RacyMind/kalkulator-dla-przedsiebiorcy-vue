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
import {computed, watch} from 'vue'
import {useQuasar} from 'quasar'

interface Props {
  modelValue: AmountTypes
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()

const amountType = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

watch(amountType, () => {
  if (amountType.value === AmountTypes.Net) {
    $q.notify({
      message: 'Przy wynagrodzeniu netto obliczenia są szacunkowe. Zalecane jest korzystanie z wynagrodzenia brutto, by poznać dokładne obliczenia.',
    })
  }
})
</script>
