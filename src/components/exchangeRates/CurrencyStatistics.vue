<template>
  <div class="q-pa-md">
    <LineChart
      v-if="currencyRateStore.currencyRate"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import {useLineChart} from 'src/use/useLineChart'
import LineChart from 'components/partials/LineChart.vue'

const currencyRateStore = useCurrencyRateStore()

const chartOptions = {
  legend: {
    display: false,
  },
}

const chartData = computed(() => {
    let dates: any[] = []
    let rates: any[] = []
    if (currencyRateStore.currencyRate && currencyRateStore.currencyRate.rates) {
      dates = currencyRateStore.currencyRate.rates.map(rate => {
        return rate.effectiveDate
      })
      rates = currencyRateStore.currencyRate.rates.map(rate => {
        return {
          x: new Date(rate.effectiveDate),
          y: rate.mid,
        }
      })
    }
    return useLineChart(
      currencyRateStore.currencyRate.currency,
      dates,
      rates,
    )
  },
)
</script>
