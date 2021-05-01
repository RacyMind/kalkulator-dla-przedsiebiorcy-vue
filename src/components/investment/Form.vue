<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-4 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Kapitał*"
          autofocus
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-4 q-pl-md-sm">
        <q-input
          v-model="rate"
          type="number"
          min="0"
          step="0.01"
          label="Oprocentownie* (%)"
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-4 q-pl-md-sm">
        <q-input
          v-model="months"
          type="number"
          min="1"
          step="1"
          label="Okres lokaty* (w miesiącach)"
          color="brand"
          required
        />
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
          :disable="!amount || !rate || !months"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import Investment from 'src/logic/Investment'

export default {
  data () {
    return {
      amount: null,
      rate: null,
      months: 12,
    }
  },
  created () {
    this.$store.commit('investment/SET_AMOUNT', null)
    this.$store.commit('investment/SET_NET', null)
    this.$store.commit('investment/SET_TAX', null)
    this.$store.commit('investment/SET_GROSS', null)
  },
  methods: {
    calculate () {
      const investment = new Investment()
      investment.amount = Number(this.amount)
      investment.rateInterest = Number(this.rate) / 100
      investment.months = this.months

      investment.calculateInterest()
      investment.calculateTax()
      investment.calculateNet()

      this.$store.commit('investment/SET_AMOUNT', investment.amount)
      this.$store.commit('investment/SET_NET', investment.net)
      this.$store.commit('investment/SET_TAX', investment.tax)
      this.$store.commit('investment/SET_GROSS', investment.gross)
    },
  },
}
</script>
