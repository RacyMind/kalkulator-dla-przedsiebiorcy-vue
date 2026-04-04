<template>
  <div class="q-pa-md">
    <PieChart
      v-if="props.result?.totalCostNet"
      class="pieChart"
      :chart-data="chartData"
    />
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Result } from 'components/leasing/interfaces/Result'
import { usePieChart } from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const labels = ['Opłata wstępna', 'Kapitał w ratach', 'Odsetki', 'Wykup']

const totalCapitalInInstallments = computed(() =>
  props.result.schedule.reduce((sum, row) => sum + row.capitalPart, 0),
)

const chartData = computed(() =>
  usePieChart(labels, [
    props.result.initialPaymentNet,
    totalCapitalInInstallments.value,
    props.result.totalInterest,
    props.result.residualValueNet,
  ]),
)
</script>
