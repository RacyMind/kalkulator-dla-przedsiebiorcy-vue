<template>
  <div class="q-pa-md">
    <PieChart
      v-if="net"
      class="pieChart"
      :chart-data="data"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import PieChart from 'components/PieChart'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      net: 'interest/net',
      interest: 'interest/interest',
    }),
    data () {
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
  components: {
    PieChart,
  },
}
</script>
