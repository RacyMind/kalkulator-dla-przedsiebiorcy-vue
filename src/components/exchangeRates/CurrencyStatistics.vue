<template>
  <div class="q-pa-md">
    <LineChart
      v-if="currency"
      :key="componentKey"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import { colors } from 'quasar'
import { deepEqual } from 'src/use/deepEqual'
import { mapGetters } from 'vuex'
import LineChart from 'components/partials/LineChart'
import constants from 'src/logic/constants'
export default {
  components: {
    LineChart,
  },
  computed: {
    ...mapGetters({
      currency: 'exchangeRates/currency',
    }),
    chartData () {
      return {
        datasets: [{
          borderColor: colors.lighten(constants.COLORS.EXCHANGE_RATES, -20),
          data: this.rates,
          fill: false,
          label: this.currency.currency,
        }],
        labels: this.dates,
      }
    },
    dates () {
      return this.currency.rates.map(rate => rate.effectiveDate)
    },
    rates () {
      return this.currency.rates.map(rate => {
        return {
          x: new Date(rate.effectiveDate),
          y: rate.mid,
        }
      })
    },
  },
  data () {
    return {
      chartOptions: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'day',
            },
            type: 'time',
          }],
        },
      },
      componentKey: 0,
    }
  },
  methods: {
    forceRerender () {
      this.componentKey += 1
    },
  },
  watch: {
    currency: {
      handler (prevState, newState) {
        if (!deepEqual(prevState, newState)) {
          this.forceRerender()
        }
      },
      immediate: true,
    },
  },
}
</script>
