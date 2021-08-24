<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm text-weight-bold">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ pln(net) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składki ZUS
      </div>
      <div>
        {{ pln(zusEmployeeTotal + zusEmployerTotal) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        PPK
      </div>
      <div>
        {{ pln(employeePpk  + employerPpk) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek
      </div>
      <div>
        {{ pln(tax) }}
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
      net: 'contractOfMandate/net',
      gross: 'contractOfMandate/gross',
      basisForTax: 'contractOfMandate/basisForTax',
      expenses: 'contractOfMandate/expenses',
      tax: 'contractOfMandate/tax',
      employeeZus: 'contractOfMandate/employeeZus',
      employerZus: 'contractOfMandate/employerZus',
      employeePpk: 'contractOfMandate/employeePpk',
      employerPpk: 'contractOfMandate/employerPpk',
    }),
    zusEmployeeTotal () {
      if (this.isZusEmployeeEmpty(this.employeeZus)) {
        return 0
      }
      return Object.values(this.employeeZus).reduce((current, sum) => current + sum)
    },
    zusEmployerTotal () {
      if (this.isZusEmployerEmpty(this.employerZus)) {
        return 0
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
