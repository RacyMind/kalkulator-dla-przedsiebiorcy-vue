<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie netto
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
        Wynagrodzenie brutto
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
      net: 'contractWork/net',
      gross: 'contractWork/gross',
      basisForTax: 'contractWork/basisForTax',
      expenses: 'contractWork/expenses',
      tax: 'contractWork/tax',
    }),
  },
}
</script>
