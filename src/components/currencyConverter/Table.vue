<template>
  <div>
    <div v-if="amount">
      <div class="row justify-between q-px-md q-py-sm">
        <div>
          {{ formatToCurrency(1, fromCurrency) }}
        </div>
        <div>
          {{ formatToCurrency( valueForOne, toCurrency) }}
        </div>
      </div>
      <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
        <div>
          {{ formatToCurrency(amount, fromCurrency) }}
        </div>
        <div>
          {{ formatToCurrency( valueForWholeAmount, toCurrency) }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="q-pa-md">
      Brak danych
    </div>
  </div>
</template>

<script>
import { formatToCurrency } from 'src/use/currencyFormat'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      amount: 'currencyConverter/amount',
      fromCurrency: 'currencyConverter/fromCurrency',
      toCurrency: 'currencyConverter/toCurrency',
      valueForOne: 'currencyConverter/valueForOne',
      valueForWholeAmount: 'currencyConverter/valueForWholeAmount',
    }),
  },
  setup () {
    return { formatToCurrency }
  },
}
</script>
