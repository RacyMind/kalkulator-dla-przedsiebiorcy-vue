<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ $filters.currencyPLN(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Koszty przychodu
      </div>
      <div>
        {{ $filters.currencyPLN(expenses) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa opodatkowania
      </div>
      <div>
        {{ $filters.currencyPLN(basisForTax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek dochodowy
      </div>
      <div>
        {{ $filters.currencyPLN(tax) }}
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
        {{ $filters.currencyPLN(employeeZus.health) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka chorobowa
      </div>
      <div>
        {{ $filters.currencyPLN(employeeZus.sick) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ $filters.currencyPLN(employeeZus.rent) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ $filters.currencyPLN(employeeZus.pension) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        PPK
      </div>
      <div>
        {{ $filters.currencyPLN(employeePpk) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Wynagrodzenie brutto
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
      net: 'contractOfMandate/net',
      gross: 'contractOfMandate/gross',
      basisForTax: 'contractOfMandate/basisForTax',
      expenses: 'contractOfMandate/expenses',
      tax: 'contractOfMandate/tax',
      employeeZus: 'contractOfMandate/employeeZus',
      employeePpk: 'contractOfMandate/employeePpk',
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
