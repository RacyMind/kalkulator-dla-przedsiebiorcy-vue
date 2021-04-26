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
      net: 'contractOfMandate/net',
      tax: 'contractOfMandate/tax',
      employeeZus: 'contractOfMandate/employeeZus',
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
            this.$constants.COLORS.CHART1,
            this.$constants.COLORS.CHART2,
            this.$constants.COLORS.CHART3,
            this.$constants.COLORS.CHART4,
            this.$constants.COLORS.CHART5,
            this.$constants.COLORS.CHART6,
          ],
        }],
        labels: [
          'Wynagrodzenie netto',
          'Zaliczka na podatek dochodowy',
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
