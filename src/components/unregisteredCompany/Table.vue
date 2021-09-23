<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Dochód netto
      </div>
      <div>
        {{ pln(result.netAmount) }}
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
        Przychód
      </div>
      <div>
        {{ pln(result.grossAmount) }}
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import constants from 'src/logic/constants'
import { getResult } from 'src/logic/UnregisteredCompany'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const store = useStore()
    const amount = computed(() => store.getters['unregisteredCompany/amount'])
    const expenses = computed(() => store.getters['unregisteredCompany/expenses'])

    return {
      pln,
      amount,
      expenses,
    }
  },
  computed: {
    result () {
      return getResult(this.amount, this.expenses)
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
      const limitForUnregisteredCompany = constants.MINIMUM_SALARY / 2
      if (this.result.grossAmount > limitForUnregisteredCompany) {
        this.$q.notify({
          message: `Przekroczono limit przychodu (${limitForUnregisteredCompany} zł)  dla działalności niezarejestrowanej.`,
        })
      }
    },
  },
}
</script>
