<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kapitał
      </div>
      <div>
        {{ pln(amount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zysk brutto
      </div>
      <div>
        {{ pln(gross) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podatek
      </div>
      <div>
        {{ pln(tax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zysk netto
      </div>
      <div>
        {{ pln(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
      <div>
        Suma kapitału i zysku netto
      </div>
      <div>
        {{ pln(amount + net) }}
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
      amount: 'investment/amount',
      net: 'investment/net',
      gross: 'investment/gross',
      tax: 'investment/tax',
    }),
  },
}
</script>
