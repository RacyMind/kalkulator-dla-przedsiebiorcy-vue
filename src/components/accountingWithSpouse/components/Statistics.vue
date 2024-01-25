<template>
  <div class="q-pa-md">
    <BarChart
      class="barChart"
      :chart-data="chartData"
      :chart-options="{
        indexAxis: 'y',
      }"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {useAccountingWithSpouseStore} from 'components/accountingWithSpouse/store'
import {useBarChart} from 'src/use/useBarChart'
import BarChart from 'components/partials/statistics/BarChart.vue'

const store = useAccountingWithSpouseStore()

const labels = [
  'Oddzielnie',
  'Wspólnie',
]

const chartData = computed(() => {
  const taxAmount = store.husbandResult && store.wifeResult ? store.husbandResult.taxAmount + store.wifeResult.taxAmount : 0
  return useBarChart(
    'Podatek dochodowy',
    labels,
    [
      taxAmount,
      store.jointResult ? store.jointResult.taxAmount : 0,
    ],
  )
})
</script>
