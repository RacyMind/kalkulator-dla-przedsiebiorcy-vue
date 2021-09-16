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
import { colors } from 'quasar'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getResult } from 'src/logic/Invoice'
import PieChart from 'components/PieChart'

export default {
  setup () {
    const store = useStore()
    const amount = computed(() => store.getters['invoice/amount'])
    const amountType = computed(() => store.getters['invoice/amountType'])
    const taxRate = computed(() => store.getters['invoice/taxRate'])

    return {
      amount,
      amountType,
      taxRate,
    }
  },
  data () {
    return {
      componentKey: 0,
    }
  },
  computed: {
    result () {
      return getResult(this.amount, this.amountType, this.taxRate)
    },
    chartData () {
      return {
        datasets: [{
          data: [this.result.netAmount, this.result.taxAmount],
          backgroundColor: [colors.lighten(this.$constants.COLORS.INVOICE, -20), colors.lighten(this.$constants.COLORS.INVOICE, 20)],
        }],
        labels: [
          'Kwota netto',
          'Kwota podatku',
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
