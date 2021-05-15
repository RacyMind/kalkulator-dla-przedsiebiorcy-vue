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
      net: 'contractOfEmployment/net',
      tax: 'contractOfEmployment/tax',
      employeeZus: 'contractOfEmployment/employeeZus',
      employeePpk: 'contractOfEmployment/employeePpk',
    }),
    chartData () {
      return {
        datasets: [{
          data: [
            this.net.toFixed(2),
            this.tax.toFixed(2),
            this.employeeZus.health.toFixed(2),
            this.employeeZus.sick.toFixed(2),
            this.employeeZus.rent.toFixed(2),
            this.employeeZus.pension.toFixed(2),
            this.employeePpk.toFixed(2),
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
    employeeZus (prevState, newState) {
      if (prevState !== newState) {
        this.forceRerender()
      }
    },
    employeePpk (prevState, newState) {
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
