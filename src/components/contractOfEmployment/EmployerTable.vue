<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie brutto
      </div>
      <div>
        {{ $filters.currencyPLN(gross) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ $filters.currencyPLN(zusTotal) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka wypadkowa
      </div>
      <div>
        {{ $filters.currencyPLN(employerZus.accident) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ $filters.currencyPLN(employerZus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ $filters.currencyPLN(employerZus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka na Fundusz Pracy
      </div>
      <div>
        {{ $filters.currencyPLN(employerZus.fp) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka na FGŚP
      </div>
      <div>
        {{ $filters.currencyPLN(employerZus.fgsp) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        PPK
      </div>
      <div>
        {{ $filters.currencyPLN(employerPpk) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Suma kosztów pracodawcy
      </div>
      <div>
        {{ $filters.currencyPLN(totalAmount) }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      gross: 'contractOfEmployment/gross',
      employerZus: 'contractOfEmployment/employerZus',
      employerPpk: 'contractOfEmployment/employerPpk',
    }),
    zusTotal () {
      if (this.isZusEmpty(this.employerZus)) {
        return null
      }
      return Object.values(this.employerZus).reduce((current, sum) => current + sum)
    },
    totalAmount () {
      return this.gross + this.zusTotal + this.employerPpk
    },
  },
  methods: {
    isZusEmpty (zus) {
      if (!zus.accident && !zus.rent &&
        !zus.pension && !zus.fp && !zus.fgsp) {
        return true
      }
      return false
    },
  },
}
</script>
