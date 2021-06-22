<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Dochód netto
      </div>
      <div>
        {{ $filters.currencyPLN(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ $filters.currencyPLN(zusTotal) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka zdrowotna
      </div>
      <div>
        {{ $filters.currencyPLN(zus.health) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka chorobowa
      </div>
      <div>
        {{ $filters.currencyPLN(zus.sick) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ $filters.currencyPLN(zus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ $filters.currencyPLN(zus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka wypadkowa
      </div>
      <div>
        {{ $filters.currencyPLN(zus.accident) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka na Fundusz Pracy
      </div>
      <div>
        {{ $filters.currencyPLN(zus.fp) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Przychód netto
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
      net: 'selfEmployment/net',
      gross: 'selfEmployment/gross',
      basisForTax: 'selfEmployment/basisForTax',
      expenses: 'selfEmployment/expenses',
      tax: 'selfEmployment/tax',
      zus: 'selfEmployment/zus',
    }),
    zusTotal () {
      if (this.isZusEmpty(this.zus)) {
        return null
      }
      return Object.values(this.zus).reduce((current, sum) => current + sum)
    },
  },
  methods: {
    isZusEmpty (zus) {
      if (!zus.health && !zus.rent &&
        !zus.pension && !zus.sick && !zus.fp) {
        return true
      }
      return false
    },
  },
}
</script>
