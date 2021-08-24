<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie brutto
      </div>
      <div>
        {{ pln(gross) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ pln(zusTotal) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka wypadkowa
      </div>
      <div>
        {{ pln(employerZus.accident) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ pln(employerZus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ pln(employerZus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        PPK
      </div>
      <div>
        {{ pln(employerPpk) }}
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
import { mapGetters } from 'vuex'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    return { pln }
  },
  computed: {
    ...mapGetters({
      gross: 'contractOfMandate/gross',
      employerZus: 'contractOfMandate/employerZus',
      employerPpk: 'contractOfMandate/employerPpk',
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
      if (!zus.accident && !zus.rent && !zus.pension) {
        return true
      }
      return false
    },
  },
}
</script>
