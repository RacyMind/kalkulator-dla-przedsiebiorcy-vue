<template>
  <div>
    <q-form
      class="q-my-md q-px-md">
      <q-input
        v-model="rateDate"
        color="brand"
        mask="##.##.####"
        label="Data notowań*"
        :rules="[
          validationRules.todayOrPast,
        ]">
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer">
          </q-icon>
        </template>
        <DatePopup
          v-model="rateDate"
          only-past-or-today
          only-work-days
        />
      </q-input>
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
      class="no-shadow"
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

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {format, isToday, parse} from 'date-fns'
import {useCurrencyRateStore} from 'stores/currency-rate-store'
import {useQuasar} from 'quasar'
import {useRouter} from 'vue-router'
import DatePopup from 'components/partials/DatePopup.vue'
import npb from 'src/api/nbp'
import validationRules from 'src/logic/validationRules'

const $q = useQuasar()
const currencyRateStore = useCurrencyRateStore()
const router = useRouter()

const columns = [
  {
    align: 'left',
    field: (row: any) => row.currency,
    format: (val: string) => `${val}`,
    label: 'Nazwa waluty',
    name: 'currency',
    required: true,
    style: 'max-width:200px;  white-space: normal !important;word-wrap: break-word;',
  },
  {
    align: 'left',
    field: (row: any) => row.code,
    format: (val: string) => `${val}`,
    label: 'Kod waluty',
    name: 'code',
    required: true,
  },
  {
    align: 'left',
    field: (row: any) => row.mid,
    format: (val: string) => `${val}`,
    label: 'Kurs średni',
    name: 'mid',
    required: true,
  },
]

const rateDate = ref(format(new Date(), 'dd.MM.Y'))

const formattedRateDate = computed(() => {
  if(!rateDate.value) {
    return new Date()
  }
  return parse(
    rateDate.value,
    'dd.MM.y',
    new Date(),
  )
})

watch(rateDate, () => {
  updateRates()
})

const openCurrency = (event:Event, row:any) => {
  console.log(`/kursy-walut/${row.code.toLowerCase()}`)
  router.push({
    path: `/kursy-walut/${row.code.toLowerCase()}`,
  })
}

const updateRates = () => {
  const currencyRateStore = useCurrencyRateStore()
  let apiCall

  currencyRateStore.isLoading = true

  if (isToday(formattedRateDate.value)) {
    apiCall = npb.loadLatestExchangeRates()
  } else {
    const date = format(formattedRateDate.value, 'Y-MM-dd')
    apiCall = npb.loadExchangeRatesFromDate(date)
  }
  apiCall.then(response => {
    currencyRateStore.date = response.data[0].effectiveDate
    currencyRateStore.currencyRates = response.data[0].rates

    $q.notify({
      message: 'Źródło danych: Narodowy Bank Polski',
    })
  }).catch((error) => {
    currencyRateStore.date = format(formattedRateDate.value, 'dd.MM.Y')
    let message = 'Nie udało się połączyć z serwerem NBP. Spróbuj ponownie'
    if (error.response) {
      message = error.response.data
    }
    $q.notify({
      message: message,
    })
    currencyRateStore.currencyRates = []
  }).finally(() => {
    currencyRateStore.isLoading = false
  })
}

updateRates()
</script>
