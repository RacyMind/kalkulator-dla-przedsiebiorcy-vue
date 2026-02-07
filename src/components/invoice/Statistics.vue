<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script setup lang="ts">
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import {computed} from 'vue'
import {usePieChart} from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'
import invoice from './invoice'

interface Props {
  input: InvoiceInputFields
}

const props = defineProps<Props>()

const labels: string[] = [
  'Kwota netto',
  'Kwota podatku',
]

const result = computed(() => invoice.getResult(props.input))

const chartData = computed(() => usePieChart(
    labels,
    [
      result.value.netAmount,
      result.value.taxAmount,
    ],
  ),
)
</script>
