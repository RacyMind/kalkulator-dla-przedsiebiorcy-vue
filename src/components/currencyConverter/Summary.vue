<template>
  <div>
    <div v-if="currencyConverterStore.amount">
      <ListRow
        :name="formatToCurrency(1, currencyConverterStore.fromCurrency)"
        :value="formatToCurrency(currencyConverterStore.valueForOne, currencyConverterStore.toCurrency)"
      />
      <ListRow
        class="bg-primary text-white"
        :name="formatToCurrency(currencyConverterStore.amount, currencyConverterStore.fromCurrency)"
        :value="formatToCurrency(currencyConverterStore.valueForWholeAmount, currencyConverterStore.toCurrency)"
      />
    </div>
    <div
      v-else
      class="q-pa-md">
      Brak danych
    </div>
  </div>
</template>

<script lang="ts" setup>
import {formatToCurrency} from 'src/composables/currencyFormat'
import {useCurrencyConverterStore} from 'stores/currency-converter-store'
import ListRow from 'components/partials/ListRow.vue'

const currencyConverterStore = useCurrencyConverterStore()
</script>
