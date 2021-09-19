<template>
  <div class="q-pa-md">
    <LineChart
      v-if="currency"
      :key="componentKey"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { colors } from 'quasar'
import constants from 'src/logic/constants'
import { deepEqual } from 'src/use/deepEqual'
import LineChart from '../LineChart'
export default {
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    ...mapGetters({
      currency: 'exchangeRates/currency',
    }),
    dates () {
      return this.currency.rates.map(rate => rate.effectiveDate)
    },
    rates () {
      return this.currency.rates.map(rate => rate.mid)
    },
    chartData () {
      return {
        labels: this.dates,
        datasets: [{
          label: this.currency.currency,
          data: this.rates,
          fill: false,
          borderColor: colors.lighten(constants.COLORS.EXCHANGE_RATES, -20),
        }],
      }
    },
  },
  watch: {
    currency (prevState, newState) {
      if (!deepEqual(prevState, newState)) {
        this.forceRerender()
      }
    },
  },
  methods: {
    forceRerender () {
      this.componentKey += 1
    },
  },
  components: {
    LineChart,
  },
}
</script>
