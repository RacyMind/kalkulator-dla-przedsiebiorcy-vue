<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-toggle
          v-model="hasTaxFreeAmount"
          label="Kwota wolna od podatku"
          :checked-icon="matCheck"
          :unchecked-icon="matClear"
        />
        <Tooltip class="q-ml-sm">
          Kwota wolna jest odliczana od podatku równomiernie w każdym miesiącu roku.
        </Tooltip>
      </div>
    </div>
    <div
      v-if="hasTaxFreeAmount"
      class="row q-col-gutter-md q-mb-md">
      <div class="col">
        <q-select
          v-model="employerCount"
          :options="options"
          emit-value
          map-options
          label="Kwota odliczana u" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import Tooltip from 'components/partials/Tooltip.vue'
import {matCheck, matClear} from 'src/icons'

interface Props {
  hasTaxFreeAmount: boolean
  employerCount: number
}
const props = defineProps<Props>()
const emit = defineEmits(['update:hasTaxFreeAmount', 'update:employerCount'])

const options = [
  {
    label: '1 płatnika',
    value: 1,
  },
  {
    label: '2 płatników',
    value: 2,
  },
  {
    label: '3 płatników',
    value: 3,
  },
]

const hasTaxFreeAmount = computed({
  get() {
    return props.hasTaxFreeAmount
  },
  set(value) {
    emit('update:hasTaxFreeAmount', value)
  },
})

const employerCount = computed({
  get() {
    return props.employerCount
  },
  set(value) {
    emit('update:employerCount', value)
  },
})
</script>
