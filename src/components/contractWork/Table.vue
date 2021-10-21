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
import { computed } from 'vue'
import { useStore } from 'vuex'
import constants from 'src/logic/constants'
import { getResult } from 'src/logic/ContractWork'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const store = useStore()
    const amount = computed(() => store.getters['contractWork/amount'])
    const amountType = computed(() => store.getters['contractWork/amountType'])
    const expenseRate = computed(() => store.getters['contractWork/expenseRate'])

    return {
      pln,
      amount,
      amountType,
      expenseRate,
    }
  },
  computed: {
    result () {
      return getResult(this.amount, this.amountType, this.expenseRate)
    },
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
      if (this.amount && this.result.grossAmount <= constants.LUMP_SUM_UP_TO_AMOUNT) {
        this.$q.notify({
          message: `Dla wynagrodzenia brutto do ${pln(constants.LUMP_SUM_UP_TO_AMOUNT)} płaci się podatek zryczałtowany.`,
        })
      }
      if (this.expenseRate === constants.CONTRACT_WORK.EXPENSES_50 && this.result.expenses >= constants.AMOUNT_OF_TAX_THRESHOLD) {
        this.$q.notify({
          message: `Przy 50% uzyskania kosztów przychodu obowiązuje limit kosztów w kwocie ${pln(constants.AMOUNT_OF_TAX_THRESHOLD)}.`,
        })
      }
    },
  },
}
</script>
