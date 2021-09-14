<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          label="Kwota*"
          autofocus
          color="brand"
          :rules="[
            val => !!val || '* Wpisz kwotę',
          ]"
          lazy-rules
        />
        <div class="q-mt-sm block">
          <q-radio
            v-model="amountType"
            val="net"
            label="netto"
          />
          <q-radio
            v-model="amountType"
            val="gross"
            label="brutto"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-select
          v-model="taxRate"
          :options="constants.VAT_VALUES"
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
          :disable="isDisabled"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import constants from 'src/logic/constants'
import { calculateGrossAmount, calculateNetAmount, calculateTaxAmount } from 'src/logic/Invoice'

export default {
  emits: ['scroll'],
  setup () {
    return { constants }
  },
  data () {
    return {
      amount: null,
      amountType: 'net',
      taxRate: null,
    }
  },
  created () {
    this.taxRate = this.constants.DEFAULT_VAT_VALUE
    this.$store.commit('invoice/CLEAR_DATA')
  },
  computed: {
    isDisabled () {
      if (!this.amount || this.taxRate === null) {
        return true
      }
      return false
    },
  },
  methods: {
    calculate () {
      const taxRate = Number(this.taxRate.value) / 100
      let netAmount, grossAmount, taxAmount

      if (this.amountType === 'net') {
        netAmount = Number(this.amount)
        taxAmount = calculateTaxAmount(netAmount, taxRate)
        grossAmount = calculateGrossAmount(netAmount, taxAmount)
      } else {
        grossAmount = Number(this.amount)
        netAmount = calculateNetAmount(grossAmount, taxRate)
        taxAmount = calculateTaxAmount(netAmount, taxRate)
      }

      this.$store.commit('invoice/SET_NET', netAmount)
      this.$store.commit('invoice/SET_TAX', taxAmount)
      this.$store.commit('invoice/SET_GROSS', grossAmount)

      this.$emit('scroll')
    },
  },
}
</script>
