<template>
  <div class="q-pa-md">
    <BarChart
      v-if="props.taxScale"
      class="barChart"
      :chart-data="chartData"
      :chart-options="{
        indexAxis: 'y',
      }"
    />
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {useBarChart} from 'src/composables/useBarChart'
import BarChart from 'components/partials/statistics/BarChart.vue'

interface Props {
  taxScale: number
  flatTax: number
  lumpSumTax: number
}
const props = defineProps<Props>()

const labels = [
  'Skala podatkowa',
  'Liniowy',
  'Zryczałtowany',
]

const chartData = computed(() => useBarChart(
  'Dochód w poszczególnych formach opodatkowania',
    labels,
    [
      props.taxScale,
      props.flatTax,
      props.lumpSumTax,
    ],
  ),
)
</script>
