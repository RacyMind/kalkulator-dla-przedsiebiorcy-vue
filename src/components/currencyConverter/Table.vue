<template>
  <div>
    <div v-if="amount">
      <div class="row justify-between q-px-md q-py-sm">
        <div>
          {{ $filters.currency(1, fromCurrency) }}
        </div>
        <div>
          {{ $filters.currency( valueForOne, toCurrency) }}
        </div>
      </div>
      <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
        <div>
          {{ $filters.currency(amount, fromCurrency) }}
        </div>
        <div>
          {{ $filters.currency( valueForWholeAmount, toCurrency) }}
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
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      amount: 'currencyConverter/amount',
      valueForOne: 'currencyConverter/valueForOne',
      valueForWholeAmount: 'currencyConverter/valueForWholeAmount',
      fromCurrency: 'currencyConverter/fromCurrency',
      toCurrency: 'currencyConverter/toCurrency',
    }),
  },
}
</script>
