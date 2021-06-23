<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa wymiaru składek
      </div>
      <div>
        {{ $filters.currencyPLN(basisForZus) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka zdrowotna
      </div>
      <div>
        {{ $filters.currencyPLN(zus.health) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka chorobowa
      </div>
      <div>
        {{ $filters.currencyPLN(zus.sick) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka rentowa
      </div>
      <div>
        {{ $filters.currencyPLN(zus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka emerytalna
      </div>
      <div>
        {{ $filters.currencyPLN(zus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka wypadkowa
      </div>
      <div>
        {{ $filters.currencyPLN(zus.accident) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składka na Fundusz Pracy
      </div>
      <div>
        {{ $filters.currencyPLN(zus.fp) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Składki ZUS
      </div>
      <div>
        {{ $filters.currencyPLN(zusTotal) }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      zus: 'partialZusContributions/zus',
      basisForZus: 'partialZusContributions/basisForZus',
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
