<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kwota netto
      </div>
      <div>
        {{ $filters.currencyPLN(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Kwota podatku
      </div>
      <div>
        {{ $filters.currencyPLN(tax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Kwota brutto
      </div>
      <div>
        {{ $filters.currencyPLN(gross) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      net: 'invoice/net',
      tax: 'invoice/tax',
      gross: 'invoice/gross',
    }),
  },
}
</script>
