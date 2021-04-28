<template>
  <div class="q-pa-md">
    <PieChart
      v-if="gross"
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
      gross: 'contractOfEmployment/gross',
      employerZus: 'contractOfEmployment/employerZus',
      employerPpk: 'contractOfEmployment/employerPpk',
    }),
    data () {
      return {
        datasets: [{
          data: [
            this.gross.toFixed(2),
            this.employerZus.accident.toFixed(2),
            this.employerZus.rent.toFixed(2),
            this.employerZus.pension.toFixed(2),
            this.employerZus.fp.toFixed(2),
            this.employerZus.fgsp.toFixed(2),
            this.employerPpk.toFixed(2),
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
          'Wynagrodzenie netto',
          'Zaliczka na podatek dochodowy',
          'Składka zdrowotna',
          'Składka chorobowa',
          'Składka rentowa',
          'Składka emerytalna',
          'PPK',
        ],
      }
    },
  },
  components: {
    PieChart,
  },
}
</script>
