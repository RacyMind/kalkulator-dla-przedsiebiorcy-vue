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
import { colors } from 'quasar'

export default {
  computed: {
    ...mapGetters({
      gross: 'contractOfEmployment/gross',
      employerZus: 'contractOfEmployment/employerZus',
    }),
    data () {
      return {
        datasets: [{
          data: [
            this.gross.toFixed(2),
            this.employerZus.accident.toFixed(2),
            this.employerZus.rent.toFixed(2),
            this.employerZus.pension.toFixed(2),
          ],
          backgroundColor: [
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, -30),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, -10),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, 10),
            colors.lighten(this.$constants.COLORS.CONTRACT_OF_MANDATE, 30),
          ],
        }],
        labels: [
          'Wynagrodzenie brutto',
          'Składka wypadkowa',
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
