<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Data rozpoczęcia sprzedaży:
      </div>
      <div>
        {{ formatDate(sellStartDate, 'dd.MM.yyyy ') }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Liczba dni sprzedaży do końca roku
      </div>
      <div>
        {{ daysToEndYear }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Limit obrotu uprawniający do zwolnienia
      </div>
      <div>
        {{ pln(amount) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { pln } from 'src/use/currencyFormat'

export default {
  setup () {
    const formatDate = (date, dateFormat) => {
      if (!date) {
        return null
      }
      return format(new Date(date), dateFormat) + ' r.'
    }
    return { pln, formatDate }
  },
  computed: {
    ...mapGetters({
      sellStartDate: 'cashRegisterLimit/sellStartDate',
      daysToEndYear: 'cashRegisterLimit/daysToEndYear',
      amount: 'cashRegisterLimit/amount',
    }),
  },
}
</script>
