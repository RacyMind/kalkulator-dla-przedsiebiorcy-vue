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
    <q-radio
      v-if="props.showEmployerCost"
      v-model="amountType"
      :val="AmountTypes.EmployerCost"
      label="koszt pracodawcy"
    />
  </div>
</template>

<script setup lang="ts">
import {AmountTypes} from 'stores/constantsStore'
import {computed, watch} from 'vue'
import {useQuasar} from 'quasar'

interface Props {
  modelValue: AmountTypes
  showEmployerCost?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showEmployerCost: false,
})
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
      message:
        'Przy wynagrodzeniu netto obliczenia są szacunkowe. Zalecane jest korzystanie z wynagrodzenia brutto, by poznać dokładne obliczenia.',
    })
  }

  if (amountType.value === AmountTypes.EmployerCost) {
    $q.notify({
      message:
        'Przy koszcie pracodawcy obliczenia są szacunkowe. Zalecane jest korzystanie z wynagrodzenia brutto, by poznać dokładne obliczenia.',
    })
  }
})
</script>
