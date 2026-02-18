<template>
  <div class="q-pa-md">
    <PieChart v-if="hasChartData" class="pieChart" :chart-data="chartData" />
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import { EntrepreneurResult } from 'src/logic/interfaces/EntrepreneurResult'
import { computed } from 'vue'
import { usePieChart } from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  result: EntrepreneurResult
}
const props = defineProps<Props>()

const labels = [
  'Dochód',
  'Koszty',
  'Zaliczka na podatek dochodowy',
  'Składka zdrowotna',
  'Składka chorobowa',
  'Składka rentowa',
  'Składka emerytalna',
  'Składka wypadkowa',
  'Składka na Fundusz Pracy i Fundusz Solidarnościowy',
]

const values = computed(() => [
  props.result.income,
  props.result.expenses,
  props.result.taxAmount,
  props.result.healthContribution,
  props.result.sickContribution,
  props.result.disabilityContribution,
  props.result.pensionContribution,
  props.result.accidentContribution,
  props.result.fpAndFsContribution,
])

const chartData = computed(() => usePieChart(labels, values.value))

const hasChartData = computed(() => {
  const data = chartData.value.datasets?.[0]?.data ?? []

  return data.some((value) => Number(value) > 0)
})
</script>
