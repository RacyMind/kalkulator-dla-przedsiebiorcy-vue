<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm text-weight-bold">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ $filters.currencyPLN(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div>
        {{ $filters.currencyPLN(zusEmployeeTotal + zusEmployerTotal) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        PPK
      </div>
      <div>
        {{ $filters.currencyPLN(employeePpk  + employerPpk) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek
      </div>
      <div>
        {{ $filters.currencyPLN(tax) }}
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
      net: 'contractOfEmployment/net',
      gross: 'contractOfEmployment/gross',
      basisForTax: 'contractOfEmployment/basisForTax',
      expenses: 'contractOfEmployment/expenses',
      tax: 'contractOfEmployment/tax',
      employeeZus: 'contractOfEmployment/employeeZus',
      employerZus: 'contractOfEmployment/employerZus',
      employeePpk: 'contractOfEmployment/employeePpk',
      employerPpk: 'contractOfEmployment/employerPpk',
    }),
    zusEmployeeTotal () {
      if (this.isZusEmployeeEmpty(this.employeeZus)) {
        return null
      }
      return Object.values(this.employeeZus).reduce((current, sum) => current + sum)
    },
    zusEmployerTotal () {
      if (this.isZusEmployerEmpty(this.employerZus)) {
        return null
      }
      return Object.values(this.employerZus).reduce((current, sum) => current + sum)
    },
    totalAmount () {
      return this.gross + this.zusEmployerTotal + this.employerPpk
    },
  },
  methods: {
    isZusEmployeeEmpty (zus) {
      if (!zus.health && !zus.rent &&
        !zus.pension && !zus.sick) {
        return true
      }
      return false
    },
    isZusEmployerEmpty (zus) {
      if (!zus.accident && !zus.rent &&
        !zus.pension && !zus.fp && !zus.fgsp) {
        return true
      }
      return false
    },
  },
}
</script>
