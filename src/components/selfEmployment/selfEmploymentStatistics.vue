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
      net: 'selfEmployment/net',
      tax: 'selfEmployment/tax',
      employeeZus: 'selfEmployment/employeeZus',
    }),
    data () {
      return {
        datasets: [{
          data: [
            this.net.toFixed(2),
            this.tax.toFixed(2),
            this.employeeZus.health.toFixed(2),
            this.employeeZus.sick.toFixed(2),
            this.employeeZus.rent.toFixed(2),
            this.employeeZus.pension.toFixed(2),
          ],
          backgroundColor: [
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, -30),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, -20),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, -10),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, 0),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, 10),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, 20),
          ],
        }],
        labels: [
          'Wynagrodzenie netto',
          'Zaliczka na podatek',
          'Składka zdrowotna',
          'Składka chorobowa',
          'Składka rentowa',
          'Składka emerytalna',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
