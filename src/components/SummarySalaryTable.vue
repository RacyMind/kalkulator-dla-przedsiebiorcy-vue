<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm text-weight-bold">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ pln(netAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div>
        {{ pln(totalZusContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka PPK
      </div>
      <div>
        {{ pln(totalPpkContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek
      </div>
      <div>
        {{ pln(taxAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Suma kosztów pracodawcy
      </div>
      <div>
        {{ pln(totalAmount) }}
      </div>
    </div>
  </div>
</template>

<script>
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    return {
      pln,
    }
  },
  props: ['netAmount', 'totalZusContributions', 'totalPpkContributions', 'taxAmount', 'totalAmount'],
}
</script>
