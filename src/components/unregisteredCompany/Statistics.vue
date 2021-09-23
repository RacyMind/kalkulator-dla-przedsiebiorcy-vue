<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount"
      :key="componentKey"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import constants from 'src/logic/constants'
import { getResult } from 'src/logic/UnregisteredCompany'
import PieChart from 'components/PieChart'

export default {
  setup () {
    const store = useStore()
    const amount = computed(() => store.getters['unregisteredCompany/amount'])
    const expenses = computed(() => store.getters['unregisteredCompany/expenses'])

    return {
      amount,
      expenses,
    }
  },
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    result () {
      return getResult(this.amount, this.expenses)
    },
    chartData () {
      return {
        datasets: [{
          data: [
            this.result.netAmount,
            this.result.taxAmount,
          ],
          backgroundColor: [
            constants.COLORS.CHART1,
            constants.COLORS.CHART2,
          ],
        }],
        labels: [
          'Dochód netto',
          'Zaliczka na podatek dochodowy',
        ],
      }
    },
  },
  watch: {
    result (prevState, newState) {
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
