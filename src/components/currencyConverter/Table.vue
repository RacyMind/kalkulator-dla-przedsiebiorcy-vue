<template>
  <div>
    <div v-if="currencyConverterStore.amount">
      <div class="row justify-between q-px-md q-py-sm">
        <div>
          {{ formatToCurrency(1, currencyConverterStore.fromCurrency) }}
        </div>
        <div>
          {{ formatToCurrency( currencyConverterStore.valueForOne, currencyConverterStore.toCurrency) }}
        </div>
      </div>
      <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
        <div>
          {{ formatToCurrency(currencyConverterStore.amount, currencyConverterStore.fromCurrency) }}
        </div>
        <div>
          {{ formatToCurrency( currencyConverterStore.valueForWholeAmount, currencyConverterStore.toCurrency) }}
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

<script lang="ts">
import {defineComponent} from 'vue'
import { formatToCurrency } from 'src/use/currencyFormat'
import {useCurrencyConverterStore} from 'stores/currency-converter-store'
export default defineComponent({
  setup () {
    const currencyConverterStore = useCurrencyConverterStore()
    return {
      currencyConverterStore,
      formatToCurrency,
    }
  },
})
</script>
