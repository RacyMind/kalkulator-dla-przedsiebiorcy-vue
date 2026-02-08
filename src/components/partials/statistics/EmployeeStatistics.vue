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
import {EmployeeResult} from 'src/logic/interfaces/EmployeeResult'
import { computed } from 'vue'
import {usePieChart} from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  result: EmployeeResult
}
const props = defineProps<Props>()

const labels = [
  'Wynagrodzenie netto',
  'Zaliczka na podatek dochodowy',
  'Składka zdrowotna',
  'Składka chorobowa',
  'Składka rentowa',
  'Składka emerytalna',
  'Składka na PPK',
]

const chartData = computed(() => usePieChart(
    labels,
    [
      props.result.netAmount,
      props.result.taxAmount,
      props.result.healthContribution,
      props.result.sickContribution,
      props.result.disabilityContribution,
      props.result.pensionContribution,
      props.result.ppkContribution,
    ],
  ),
)
</script>
