<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Dochód netto
      </div>
      <div>
        {{ pln(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Koszty przychodu
      </div>
      <div>
        {{ pln(expenses) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa opodatkowania
      </div>
      <div>
        {{ pln(basisForTax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek dochodowy
      </div>
      <div>
        {{ pln(tax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Przychód
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
      net: 'unregisteredCompany/net',
      gross: 'unregisteredCompany/gross',
      basisForTax: 'unregisteredCompany/basisForTax',
      expenses: 'unregisteredCompany/expenses',
      tax: 'unregisteredCompany/tax',
    }),
  },
}
</script>
