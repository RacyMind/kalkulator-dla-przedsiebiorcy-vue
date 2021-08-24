<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kwota
      </div>
      <div>
        {{ pln(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Odsetki
      </div>
      <div>
        {{ pln(interest) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Liczba dni
      </div>
      <div>
        {{ days }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Suma kwoty i odsetek
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
      net: 'interest/net',
      interest: 'interest/interest',
      gross: 'interest/gross',
      days: 'interest/days',
    }),
  },
}
</script>
