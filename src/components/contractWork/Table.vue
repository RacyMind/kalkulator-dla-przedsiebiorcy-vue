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
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white">
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
import { useResult, inputData } from 'src/use/useContractWork'
import { pln } from 'src/use/currencyFormat'

export default {
  props: {
    year: Number,
  },
  setup (props) {
    const { result } = useResult(props)
    const { amount, expenseRate } = inputData()

    return {
      pln,
      amount,
      expenseRate,
      result,
    }
  },
  watch: {
    amount: function (val) {
      if (val) {
        this.showNotifications()
      }
    },
  },
  methods: {
    showNotifications () {
      if (this.amount && this.result.grossAmount <= constants.PARAMS[this.year].LUMP_SUM_UP_TO_AMOUNT) {
        this.$q.notify({
          message: `Dla wynagrodzenia brutto do ${pln(constants.PARAMS[this.year].LUMP_SUM_UP_TO_AMOUNT)} płaci się podatek zryczałtowany.`,
        })
      }
      if (this.expenseRate === constants.CONTRACT_WORK.EXPENSES_50 && this.result.expenses >= constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Przy 50% uzyskania kosztów przychodu obowiązuje limit kosztów w kwocie ${pln(constants.PARAMS[this.year].AMOUNT_OF_TAX_THRESHOLD)}.`,
        })
      }
    },
  },
}
</script>
