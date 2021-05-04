<template>
  <div>
    <div v-if="amount">
      <div class="row justify-between q-px-md q-py-sm">
        <div>
          {{1 | currency(fromCurrency)}}
        </div>
        <div>
          {{ valueForOne | currency(toCurrency) }}
        </div>
      </div>
      <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
        <div>
          {{amount | currency(fromCurrency)}}
        </div>
        <div>
          {{ valueForWholeAmount | currency(toCurrency) }}
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
