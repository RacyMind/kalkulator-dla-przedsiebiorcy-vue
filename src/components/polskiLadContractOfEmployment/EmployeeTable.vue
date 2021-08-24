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
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ pln(zusTotal) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka zdrowotna
      </div>
      <div>
        {{ pln(employeeZus.health) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka chorobowa
      </div>
      <div>
        {{ pln(employeeZus.sick) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ pln(employeeZus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ pln(employeeZus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        PPK
      </div>
      <div>
        {{ pln(employeePpk) }}
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
      net: 'polskiLadContractOfEmployment/net',
      gross: 'polskiLadContractOfEmployment/gross',
      basisForTax: 'polskiLadContractOfEmployment/basisForTax',
      expenses: 'polskiLadContractOfEmployment/expenses',
      tax: 'polskiLadContractOfEmployment/tax',
      employeeZus: 'polskiLadContractOfEmployment/employeeZus',
      employeePpk: 'polskiLadContractOfEmployment/employeePpk',
    }),
    zusTotal () {
      if (this.isZusEmpty(this.employeeZus)) {
        return null
      }
      return Object.values(this.employeeZus).reduce((current, sum) => current + sum)
    },
  },
  methods: {
    isZusEmpty (zus) {
      if (!zus.health && !zus.rent &&
        !zus.pension && !zus.sick) {
        return true
      }
      return false
    },
  },
}
</script>
