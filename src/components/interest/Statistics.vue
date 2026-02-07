<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.amount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script setup lang="ts">
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {computed} from 'vue'
import {usePieChart} from 'src/composables/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'
import interest from 'components/interest/interest'

interface Props {
  input: InterestInputFields
}

const props = defineProps<Props>()

const labels: string[] = [
  'Kwota',
  'Odsetki',
]

const result = computed(() => interest.getResult(props.input))

const chartData = computed(() => usePieChart(
    labels,
    [
      result.value.amount,
      result.value.interestAmount,
    ],
  ),
)
</script>
