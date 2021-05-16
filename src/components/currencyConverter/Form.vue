<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-4 q-pr-md-sm">
        <q-input
          v-model="amount"
          type="number"
          min="0"
          step="0.01"
          label="Kwota*"
          color="brand"
          required
        />
      </div>
      <div class="col-12 col-md-4 q-pl-md-sm q-pr-md-sm">
        <q-select
          v-model="fromCurrency"
          :options="currencies"
          label="Mam*"
          color="brand"
          use-input
          input-debounce="0"
          @filter="filterCurrency"
        />
      </div>
      <div class="col-12 col-md-4 q-pl-md-sm">
        <q-select
          v-model="toCurrency"
          :options="currencies"
          label="Chcę*"
          color="brand"
          use-input
          input-debounce="0"
          @filter="filterCurrency"
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
          :disable="isDisabled()"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import CurrencyConverter from 'src/logic/CurrencyConverter'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      amount: null,
      fromCurrency: null,
      toCurrency: null,
      currencies: [],
      allRates: [],
      pln: {
        code: 'PLN',
        currency: 'złoty',
        mid: 1,
      },
    }
  },
  emits: ['scroll'],
  async created () {
    this.$store.commit('currencyConverter/CLEAR_DATA')

    if (this.rates.length === 0) {
      await this.$store.dispatch('exchangeRates/loadLatestExchangeRates')
    }

    this.$q.notify({
      message: 'Źródło danych: Narodowy Bank Polski',
    })
  },
  computed: {
    ...mapGetters({
      rates: 'exchangeRates/rates',
      isLoading: 'exchangeRates/isLoading',
    }),
  },
  methods: {
    calculate () {
      const currencyConverter = new CurrencyConverter()
      const fromRatio = Number(this.fromCurrency.mid)
      const toRatio = Number(this.toCurrency.mid)

      this.$store.commit('currencyConverter/SET_AMOUNT', this.amount)
      this.$store.commit('currencyConverter/SET_VALUE_FOR_ONE', currencyConverter.convert(1, fromRatio, toRatio))
      this.$store.commit('currencyConverter/SET_VALUE_FOR_WHOLE_AMOUNT', currencyConverter.convert(this.amount, fromRatio, toRatio))
      this.$store.commit('currencyConverter/SET_FROM_CURRENCY', this.fromCurrency.code)
      this.$store.commit('currencyConverter/SET_TO_CURRENCY', this.toCurrency.code)

      this.$emit('scroll')
    },
    filterCurrency (val, update) {
      let allRates = [this.pln]
      allRates = allRates.concat(JSON.parse(JSON.stringify(this.rates)))
      allRates.forEach(rate => {
        rate.label = `${rate.code} ${rate.currency}`
      })

      if (val === '') {
        update(() => {
          this.currencies = allRates
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.currencies = allRates.filter(currency => currency.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    isDisabled () {
      if (this.isLoading) {
        return true
      }
       return !this.amount || !this.fromCurrency || !this.toCurrency
    },
  },
}
</script>
