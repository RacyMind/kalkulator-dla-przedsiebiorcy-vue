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
      net: 'contractWork/net',
      tax: 'contractWork/tax',
    }),
    data () {
      return {
        datasets: [{
          data: [this.net.toFixed(2), this.tax.toFixed(2)],
          backgroundColor: [
            this.$constants.COLORS.CHART1,
            this.$constants.COLORS.CHART2,
          ],
        }],
        labels: [
          'Wynagrodzenie netto',
          'Zaliczka na podatek dochodowy',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
