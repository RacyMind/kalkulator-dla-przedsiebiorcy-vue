<template>
  <div class="q-pa-md">
    <div class="text-subtitle2 q-mb-sm">
      Narzędzie: <strong>{{ chartToolLabel }}</strong>
    </div>
    <div class="chartContainer">
      <LineChart
        v-if="props.result.chartLabels.length > 0"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
      <span v-else>Brak danych</span>
    </div>
    <LineChartLegend
      v-if="props.result.chartLabels.length > 0"
      class="q-mt-md"
      :items="legendItems"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Result } from 'components/savingsPlan/interfaces/Result'
import {
  getSavingsPlanScenarioLabel,
  getSavingsPlanToolLabel,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { pln } from 'src/composables/currencyFormat'
import { useChartColors } from 'src/composables/useChartColors'
import LineChart from 'components/partials/LineChart.vue'
import LineChartLegend from 'components/partials/statistics/LineChartLegend.vue'

interface Props {
  result: Result
}

const props = defineProps<Props>()
const { chartColors } = useChartColors()

const chartToolLabel = computed(() =>
  getSavingsPlanToolLabel(props.result.activeTool),
)

const chartOptions = {
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Prognoza wartości portfela',
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 8,
        maxRotation: 0,
        minRotation: 0,
      },
    },
    y: {
      ticks: {
        maxTicksLimit: 6,
      },
    },
  },
}

const chartData = computed(() => {
  const colors = Object.values(chartColors.value)

  return {
    labels: props.result.chartLabels,
    datasets: props.result.chartSeries.map((series, index) => ({
      label: getSavingsPlanScenarioLabel(series.scenario),
      data: series.values,
      borderColor: colors[index],
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.2,
    })),
  }
})

const legendItems = computed(() => {
  const colors = Object.values(chartColors.value)

  return props.result.chartSeries.map((series, index) => {
    const finalValue = series.values.at(-1) ?? 0

    return {
      label: getSavingsPlanScenarioLabel(series.scenario),
      color: colors[index] ?? '#1565C0',
      value: finalValue,
      valueLabel: pln(finalValue),
    }
  })
})
</script>

<style lang="scss" scoped>
.chartContainer {
  min-height: 280px;
}
</style>
