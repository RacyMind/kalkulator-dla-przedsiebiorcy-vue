<template>
  <div class="q-pa-md">
    <PieChart
      v-if="zus.health"
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
      zus: 'partialZusContributions/zus',
    }),
    chartData () {
      return {
        datasets: [{
          data: [
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
          ],
        }],
        labels: [
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
