<template>
  <q-form @submit.prevent="save">
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
            v-model="typeAmount"
            val="net"
            label="netto"
            color="red-8"
          />
          <q-radio
            v-model="typeAmount"
            val="gross"
            label="brutto"
            color="red-8"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-select
          v-model="rate"
          :options="$constants.VAT_VALUES"
          emit-value
          label="Stawka podatku VAT*"
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
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import Invoice from 'src/logic/Invoice'
export default {
  data () {
    return {
      amount: null,
      typeAmount: 'net',
      rate: 23,
    }
  },
  methods: {
    save () {
      const invoice = new Invoice()
      invoice.rateTax = Number(this.rate) / 100
      if (this.typeAmount === 'net') {
        invoice.net = Number(this.amount)
        invoice.calculateTaxAmount()
        invoice.calculateGross()
      } else {
        invoice.gross = Number(this.amount)
        invoice.calculateNet()
        invoice.calculateTaxAmount()
      }
      this.$store.commit('invoice/SET_NET', invoice.net)
      this.$store.commit('invoice/SET_TAX', invoice.taxAmount)
      this.$store.commit('invoice/SET_GROSS', invoice.gross)
    },
  },
}
</script>
