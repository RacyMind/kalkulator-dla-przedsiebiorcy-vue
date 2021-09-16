<template>
  <q-form @submit.prevent="save">
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
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import constants from 'src/logic/constants'

export default {
  emits: ['submitted'],
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
  },
  computed: {
    isDisabledButton () {
      if (!this.amount || this.taxRate === null) {
        return true
      }
      return false
    },
  },
  methods: {
    save () {
      this.$store.commit('invoice/setAmount', Number(this.amount))
      this.$store.commit('invoice/setAmountType', this.amountType)
      this.$store.commit('invoice/setTaxRate', Number(this.taxRate.value) / 100)

      this.$emit('submitted')
    },
  },
}
</script>
