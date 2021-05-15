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
      net: 'interest/net',
      interest: 'interest/interest',
    }),
    chartData () {
      return {
        datasets: [{
          data: [this.net.toFixed(2), this.interest.toFixed(2)],
          backgroundColor: [
            this.$constants.COLORS.CHART1,
            this.$constants.COLORS.CHART2,
          ],
        }],
        labels: [
          'Kwota',
          'Odsetki',
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
    interest (prevState, newState) {
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
