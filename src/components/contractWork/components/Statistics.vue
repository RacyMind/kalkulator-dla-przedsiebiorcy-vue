<template>
  <div class="q-pa-md">
    <PieChart
      v-if="props.result?.grossAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import {Result} from 'components/contractWork/interfaces/Result'
import { computed } from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const labels = [
  'Wynagrodzenie netto',
  'Zaliczka na podatek dochodowy',
]

const chartData = computed(() => usePieChart(
    labels,
    [
      props.result.netAmount,
      props.result.taxAmount,
    ],
  ),
)
</script>
