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
import {EmployerResult} from 'src/logic/interfaces/EmployerResult'
import { computed } from 'vue'
import {usePieChart} from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  result: EmployerResult
}
const props = defineProps<Props>()
const labels =  [
  'Wynagrodzenie brutto',
  'Składka wypadkowa',
  'Składka rentowa',
  'Składka emerytalna',
  'Składka na PPK',
  'Składka na Fundusz Pracy',
  'Składka na FGŚP',
  'Składka na Fundusz Solidarnościowy',
]

const chartData = computed(() => usePieChart(
    labels,
    [
      props.result.grossAmount,
      props.result.accidentContribution,
      props.result.disabilityContribution,
      props.result.pensionContribution,
      props.result.ppkContribution,
      props.result.fpContribution,
      props.result.fgspContribution,
      props.result.fsContribution,
    ],
  ),
)
</script>
