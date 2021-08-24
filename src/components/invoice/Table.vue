<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kwota netto
      </div>
      <div>
        {{ pln(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Kwota podatku
      </div>
      <div>
        {{ pln(tax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Kwota brutto
      </div>
      <div>
        {{ pln(gross) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    return { pln }
  },
  computed: {
    ...mapGetters({
      net: 'invoice/net',
      tax: 'invoice/tax',
      gross: 'invoice/gross',
    }),
  },
}
</script>
