<template>
  <div class="q-pa-md">
    <PieChart
      v-if="net"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    ...mapGetters({
      net: 'polskiLadSelfEmployment/net',
      tax: 'polskiLadSelfEmployment/tax',
      zus: 'polskiLadSelfEmployment/zus',
    }),
    chartData () {
      return {
        datasets: [{
          data: [
            this.net.toFixed(2),
            this.tax.toFixed(2),
            this.zus.health.toFixed(2),
            this.zus.sick.toFixed(2),
            this.zus.rent.toFixed(2),
            this.zus.pension.toFixed(2),
            this.zus.fp.toFixed(2),
          ],
          backgroundColor: [
            this.$constants.COLORS.CHART1,
            this.$constants.COLORS.CHART2,
            this.$constants.COLORS.CHART3,
            this.$constants.COLORS.CHART4,
            this.$constants.COLORS.CHART5,
            this.$constants.COLORS.CHART6,
            this.$constants.COLORS.CHART7,
          ],
        }],
        labels: [
          'Dochód netto',
          'Zaliczka na podatek dochodowy',
          'Składka zdrowotna',
          'Składka chorobowa',
          'Składka rentowa',
          'Składka emerytalna',
          'Składka na Fundusz Pracy',
        ],
      }
    },
  },
  watch: {
    net (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
    tax (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
    zus (prevState, newState) {
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
    PieChart,
  },
}
</script>
