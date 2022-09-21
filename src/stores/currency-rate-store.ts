import { defineStore } from 'pinia'
import {useQuasar} from 'quasar'
import npb from 'src/api/nbp'

export const useCurrencyRateStore = defineStore('currency-rate', {
  actions: {
    loadLatestExchangeRates() {
      const $q = useQuasar()

      this.isLoading = true

      npb.loadLatestExchangeRates().then(response => {
        this.date = response.data[0].effectiveDate
        this.currencyRates = response.data[0].rates
        $q.notify({
          message: 'Źródło danych: Narodowy Bank Polski',
        })
      }).catch((error) => {
        let message = 'Nie udało się połączyć z serwerem NBP. Spróbuj ponownie'
        if (error.response) {
          message = error.response.data
        }
        $q.notify({
          message: message,
        })
        this.currencyRate = null
      }).finally(() => {
        this.isLoading = false
      })
    },
  },
  state: () => ({
    currencyRate: null,
    currencyRates: [],
    date: '',
    isLoading: false,
  }),
})
