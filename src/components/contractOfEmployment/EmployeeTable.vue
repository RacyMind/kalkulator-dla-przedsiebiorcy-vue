<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Wynagrodzenie brutto
      </div>
      <div>
        {{ pln(result.grossAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Koszty przychodu
      </div>
      <div>
        {{ pln(result.expenses) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Podstawa opodatkowania
      </div>
      <div>
        {{ pln(result.basisForTax) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Zaliczka na podatek dochodowy
      </div>
      <div>
        {{ pln(result.taxAmount) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Składki ZUS
      </div>
      <div class="text-weight-bold">
        {{ pln(totalZusContributions) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka zdrowotna
      </div>
      <div>
        {{ pln(result.healthContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka chorobowa
      </div>
      <div>
        {{ pln(result.sickContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div class="q-pl-sm">
        Składka rentowa
      </div>
      <div>
        {{ pln(result.rentContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm">
      <div class="q-pl-sm">
        Składka emerytalna
      </div>
      <div>
        {{ pln(result.pensionContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Składka PPK
      </div>
      <div>
        {{ pln(result.ppkContribution) }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Wynagrodzenie netto
      </div>
      <div>
        {{ pln(result.netAmount) }}
      </div>
    </div>
  </div>
</template>
<script>
import constants from 'src/logic/constants'
import { useMonthlyEmployeeResult, inputData } from 'src/use/useContractOfEmployment'
import { pln } from 'src/use/currencyFormat'

export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { result } = useMonthlyEmployeeResult(props)
    const { grossAmount } = inputData()

    return {
      pln,
      result,
      grossAmount,
    }
  },
  computed: {
    totalZusContributions () {
      return [
        this.result.pensionContribution,
        this.result.rentContribution,
        this.result.sickContribution,
        this.result.healthContribution,
      ].reduce((current, sum) => current + sum)
    },
  },
  watch: {
    grossAmount: function (val) {
      if (val) {
        this.showNotifications()
      }
    },
  },
  methods: {
    showNotifications () {
      if (this.result.basisForTax > constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${pln(constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD)}). Dla kwoty powyżej progu stawka podatku wynosi ${constants.PARAMS[this.year].TAX_RATES.SECOND_RATE}%.`,
        })
      }
    },
  },
}
</script>
