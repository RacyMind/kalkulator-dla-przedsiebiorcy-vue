<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Przychód
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
        Dochód netto
      </div>
      <div>
        {{ pln(result.netAmount) }}
      </div>
    </div>
  </div>
</template>
<script>
import constants from 'src/logic/constants'
import { pln } from 'src/use/currencyFormat'
import { userUnregisteredCompany, inputData } from 'src/use/userUnregisteredCompany'

export default {
  setup () {
    const { amount, expenses } = inputData()
    const { result } = userUnregisteredCompany()

    return {
      pln,
      amount,
      expenses,
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
      const limitForUnregisteredCompany = constants.MINIMUM_SALARY / 2
      if (this.result.grossAmount > limitForUnregisteredCompany) {
        this.$q.notify({
          message: `Przekroczono limit przychodu (${pln(limitForUnregisteredCompany)})  dla działalności niezarejestrowanej.`,
        })
      }
    },
  },
}
</script>
