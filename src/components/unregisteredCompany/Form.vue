<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Przychód*"
          autofocus
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-input
          v-model="expenses"
          type="number"
          min="0"
          step="0.01"
          label="Koszty uzysaknia przychodu*"
          autofocus
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
          :disable="!amount"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import UnregisteredCompany from 'src/logic/UnregisteredCompany'
export default {
  data () {
    return {
      amount: null,
      expenses: 0,
      limitForUnregisteredCompany: 0,
    }
  },
  created () {
    this.limitForUnregisteredCompany = this.$constants.MINIMUM_SALARY / 2
    this.$store.commit('unregisteredCompany/CLEAR_DATA')
  },
  methods: {
    calculate () {
      const unregisteredCompany = new UnregisteredCompany()

        unregisteredCompany.gross = Number(this.amount)
        unregisteredCompany.expenses = Number(this.expenses)
        unregisteredCompany.calculateAll()

      if (unregisteredCompany.gross > this.limitForUnregisteredCompany) {
        this.$q.notify({
          message: `Przekroczono limit przycchodu (${this.limitForUnregisteredCompany} zł)  dla działalności niezarejestrowanej.`,
        })
      }

      this.$store.commit('unregisteredCompany/SET_NET', unregisteredCompany.net)
      this.$store.commit('unregisteredCompany/SET_TAX', unregisteredCompany.taxAmount)
      this.$store.commit('unregisteredCompany/SET_GROSS', unregisteredCompany.gross)
      this.$store.commit('unregisteredCompany/SET_BASIS_FOR_TAX', unregisteredCompany.basisForTax)
      this.$store.commit('unregisteredCompany/SET_EXPENSES', unregisteredCompany.expenses)

      this.$emit('scroll')
    },
  },
}
</script>
