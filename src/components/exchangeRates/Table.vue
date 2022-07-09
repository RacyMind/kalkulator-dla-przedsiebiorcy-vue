<template>
  <div>
    <q-form
      class="q-my-md q-px-md">
      <div class="row justify-between">
        <div class="col-12 col-md-6 q-pr-md-sm">
          <q-toggle
            v-model="showArchivedRates"
            class="q-mt-sm"
            label="Pokaż archiwalne kursy"
          />
        </div>
        <div
          class="col-12 col-md-6 q-pl-md-sm">
          <q-input
            v-if="showArchivedRates"
            v-model="rateDate"
            color="brand"
            mask="date"
            label="Data*"
            :rules="[
              'date',
              date => isPast(new Date(currencyRateStore.date)) || 'Wybierz datę z przeszłości'
            ]">
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy1"
                  transition-show="scale"
                  transition-hide="scale">
                  <q-date
                    v-model="rateDate"
                    :locale="constants.LOCALE_DATE"
                    :options="validDays"
                    @input="() => $refs.qDateProxy1.hide()"
                  >
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </q-form>
    <p
      class="text-center q-my-md text-primary">
      <span v-if="currencyRateStore.date">
        Kurs średni z dnia {{ currencyRateStore.date }}
      </span>
    </p>
    <q-table
      :rows="currencyRateStore.currencyRates"
      :columns="columns"
      row-key="name"
      @row-click="openCurrency"
      :loading="currencyRateStore.isLoading"
      hide-pagination
      :pagination="{rowsPerPage: 999}">
      <template v-slot:no-data>
        <div class="full-width row flex-center q-gutter-sm">
          <span>
            Brak walut do wyświetlenia
          </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { format, isPast, isWeekend } from 'date-fns'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import api from './api'
import constants from 'src/logic/constants'

export default {
  created () {
    this.updateRates()
  },
  data () {
    return {
      columns: [
        {
          align: 'left',
          field: row => row.currency,
          format: val => `${val}`,
          label: 'Nazwa waluty',
          name: 'currency',
          required: true,
          style: 'max-width:200px;  white-space: normal !important;word-wrap: break-word;',
        },
        {
          align: 'left',
          field: row => row.code,
          format: val => `${val}`,
          label: 'Kod waluty',
          name: 'code',
          required: true,
        },
        {
          align: 'left',
          field: row => row.mid,
          format: val => `${val}`,
          label: 'Kurs średni',
          name: 'mid',
          required: true,
        },
      ],
      rateDate: null,
      showArchivedRates: false,
    }
  },
  methods: {
    openCurrency (event, row) {
      this.$router.push({
        path: `/kursy-walut/${row.code.toLowerCase()}`,
      })
    },
    updateRates () {
      const currencyRateStore = useCurrencyRateStore()
      let apiCall

      currencyRateStore.isLoading = true

      if (this.rateDate) {
        const rateDate = format(new Date(this.rateDate), 'Y-MM-dd')
        apiCall = api.loadExchangeRatesFromDate(rateDate)
      } else {
        apiCall = api.loadLatestExchangeRates()
      }
      apiCall.then(response => {
        currencyRateStore.date = response.data[0].effectiveDate
        currencyRateStore.currencyRates = response.data[0].rates

        this.$q.notify({
          message: 'Źródło danych: Narodowy Bank Polski',
        })
      }).catch((error) => {
        currencyRateStore.date = format(new Date(this.rateDate), 'Y-MM-dd')
        let message = 'Nie udało się połączyć z serwerem NBP. Spróbuj ponownie'
        if (error.response) {
          message = error.response.data
        }
        this.$q.notify({
          message: message,
        })
        currencyRateStore.currencyRates = []
      }).finally(() => {
        currencyRateStore.isLoading = false
      })
    },
  },
  setup () {
    const currencyRateStore = useCurrencyRateStore()
    const onlyPast = (date) => {
      return date < format(new Date(), 'y/MM/dd')
    }
    const onlyWorkDays = (date) => {
      return !isWeekend(new Date(date))
    }
    return {
      constants,
      currencyRateStore,
      isPast,
      validDays (date) {
        return onlyPast(date) && onlyWorkDays(date)
      },
    }
  },
  watch: {
    rateDate: function () {
      this.updateRates()
    },
    showArchivedRates: function (val) {
      if (!val) {
        this.rateDate = null
      }
    },
  },
}
</script>
