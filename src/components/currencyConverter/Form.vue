<template>
  <q-form @submit.prevent="calculate">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <div class="row">
          <div class="col-12 col-md-4 q-pr-md-sm">
            <q-input
              v-model="currencyValueFrom"
              type="number"
              min="0"
              step="0.01"
              label="Mam*"
              color="brand"
              required
            />
          </div>
          <div class="col-12 col-md-6 q-pl-md-sm">
            <q-select
              v-model="currencyFrom"
              :options="currencies"
              label="Waluta*"
              color="brand"
              option-label="code"
              required
              use-input
              input-debounce="0"
              @filter="filterCurrency"
            />
          </div>
        </div>
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
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      currencyFrom: null,
      currencyValueFrom: null,
      currencyTo: null,
      currencyValueTo: null,
    }
  },
  created () {
    if (this.rates.length === 0) {
      this.$store.dispatch('exchangeRates/loadLatestExchangeRates')
    }
    this.$q.notify({
      message: 'Źródło danych: Narodowy Bank Polski',
    })
  },
  computed: {
    ...mapGetters({
      currencies: 'exchangeRates/rates',
      date: 'exchangeRates/date',
      isLoading: 'exchangeRates/isLoading',
    }),
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

      this.$emit('scroll')
    },
    filterCurrency (val, update) {
      if (val === '') {
        update(() => {
          this.options = stringOptions

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
    },

  },
}
</script>
