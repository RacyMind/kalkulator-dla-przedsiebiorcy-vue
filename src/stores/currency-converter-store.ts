import { defineStore } from 'pinia'
interface CurrencyConverterState {
  amount: null | number,
  fromCurrency: null | string,
  toCurrency: null | string,
  valueForOne: null | number,
  valueForWholeAmount: null | number,
}
export const useCurrencyConverterStore = defineStore('currency-converter-store', {
  state: ():CurrencyConverterState => ({
    amount: null,
    fromCurrency: null,
    toCurrency: null,
    valueForOne: null,
    valueForWholeAmount: null,
  }),
})
