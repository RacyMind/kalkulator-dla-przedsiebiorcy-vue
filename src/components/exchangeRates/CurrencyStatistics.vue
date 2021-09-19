<template>
  <div class="q-pa-md">
    <LineChart
      v-if="net"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { colors } from 'quasar'
import constants from 'src/logic/constants'
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
    chartData () {
      return {
        datasets: [{
          data: [],
          backgroundColor: [colors.lighten(constants.COLORS.CURRENCIES, -20)],
        }],
        labels: [
          'Kwota podatku',
        ],
      }
    },
  },
  watch: {
    currency (prevState, newState) {
      if (prevState !== newState) {
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
