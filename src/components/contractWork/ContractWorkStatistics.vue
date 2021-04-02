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
import { colors } from 'quasar'

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
          backgroundColor: [colors.lighten(this.$constants.COLORS.CONTRACT_WORK, -20), colors.lighten(this.$constants.COLORS.CONTRACT_WORK, 20)],
        }],
        labels: [
          'Wynagrodzenie netto',
          'Zaliczka na podatek',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
