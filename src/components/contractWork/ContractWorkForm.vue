<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Kwota*"
          autofocus
          color="brand"
          required
        />
        <div class="q-mt-sm block">
          <q-radio
            v-model="amountType"
            :val="$constants.AMOUNT_TYPES.NET"
            label="netto"
          />
          <q-radio
            v-model="amountType"
            :val="$constants.AMOUNT_TYPES.GROSS"
            label="brutto"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <div class="q-mt-sm block">
          <div>Koszty przychodu*</div>
          <q-radio
            v-model="expenses"
            :val="$constants.CONTRACT_WORK.EXPENSES_20"
            label="20%"
          />
          <q-radio
            v-model="expenses"
            :val="$constants.CONTRACT_WORK.EXPENSES_50"
            label="50%"
          />
        </div>
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
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import ContractWork from 'src/logic/ContractWork'
export default {
  data () {
    return {
      amount: null,
      amountType: null,
      expenses: null,
    }
  },
  created () {
    this.amountType = this.$constants.AMOUNT_TYPES.NET
    this.expenses = this.$constants.CONTRACT_WORK.EXPENSES_20
  },
  methods: {
    calculate () {
      const contractWork = new ContractWork()
      contractWork.rateExpenses = Number(this.expenses)
      if (this.amountType === this.$constants.AMOUNT_TYPES.NET) {
        ContractWork.net = Number(this.amount)
        contractWork.calculateGross()

        if (contractWork.gross <= 200) {
          contractWork.rateExpenses = 0
        }

        contractWork.calculateExpenses()
        contractWork.calculateGross()
        contractWork.calculateBasisForTax()
        contractWork.calculateTaxAmount()
        contractWork.gross = contractWork.net + contractWork.taxAmount
      }
      if (this.amountType === this.$constants.AMOUNT_TYPES.GROSS) {
        contractWork.gross = Number(this.amount)

        if (contractWork.gross <= 200) {
          contractWork.rateExpenses = 0
        }

        contractWork.calculateExpenses()
        contractWork.calculateBasisForTax()
        contractWork.calculateTaxAmount()
        contractWork.calculateNet()
      }

      this.$store.commit('contractWork/SET_NET', contractWork.net)
      this.$store.commit('contractWork/SET_TAX', contractWork.taxAmount)
      this.$store.commit('contractWork/SET_GROSS', contractWork.gross)
      this.$store.commit('contractWork/SET_BASIS_FOR_TAX', contractWork.basisForTax)
      this.$store.commit('contractWork/SET_EXPENSES', contractWork.expenses)
    },
  },
}
</script>

<style scoped>

</style>
