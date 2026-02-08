<template>
  <div class="q-pa-md">
    <PieChart
      v-if="props.result?.income"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import {Result} from 'components/unregisteredCompany/interfaces/Result'
import { computed } from 'vue'
import {usePieChart} from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const labels = [
  'Dochód',
  'Podatek dochodowy',
]

const chartData = computed(() => usePieChart(
    labels,
    [
      props.result.income,
      props.result.taxAmount,
    ],
  ),
)
</script>
