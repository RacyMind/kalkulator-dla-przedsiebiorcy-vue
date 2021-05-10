<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Kwota
      </div>
      <div>
        {{ $filters.currencyPLN(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Odsetki
      </div>
      <div>
        {{ $filters.currencyPLN(interest) }}
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
      net: 'interest/net',
      interest: 'interest/interest',
      gross: 'interest/gross',
      days: 'interest/days',
    }),
  },
}
</script>
