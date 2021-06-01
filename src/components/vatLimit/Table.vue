<template>
  <div>
    <div class="row justify-between q-px-md q-py-sm">
      <div>
        Data rozpoczęcia działalności:
      </div>
      <div>
        {{ formatDate(businessStartDate, 'dd.MM.yyyy ') }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-teal-1">
      <div>
        Liczba dni działalności do końca roku
      </div>
      <div>
        {{ daysToEndYear }}
      </div>
    </div>
    <div class="row justify-between q-px-md q-py-sm bg-primary text-white text-weight-bold">
      <div>
        Limit przychodu uprawniający do zwolnienia
      </div>
      <div>
        {{ $filters.currencyPLN(amount) }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
export default {
  computed: {
    ...mapGetters({
      businessStartDate: 'vatLimit/businessStartDate',
      daysToEndYear: 'vatLimit/daysToEndYear',
      amount: 'vatLimit/amount',
    }),
  },
  methods: {
    formatDate (date, dateFormat) {
      if (!date) {
        return null
      }
      return format(new Date(date), dateFormat) + ' r.'
    },
  },
}
</script>
