<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kapitał
      </div>
      <div>
        {{ $filters.currencyPLN(amount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zysk brutto
      </div>
      <div>
        {{ $filters.currencyPLN(gross) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podatek
      </div>
      <div>
        {{ $filters.currencyPLN(tax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zysk netto
      </div>
      <div>
        {{ $filters.currencyPLN(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Suma kapitału i zysku netto
      </div>
      <div>
        {{ $filters.currencyPLN(amount + net) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      amount: 'investment/amount',
      net: 'investment/net',
      gross: 'investment/gross',
      tax: 'investment/tax',
    }),
  },
}
</script>
