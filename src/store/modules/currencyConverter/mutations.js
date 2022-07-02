export default {
  CLEAR_DATA (state) {
    state.amount = null
    state.valueForOne = null
    state.valueForWholeAmount = null
    state.fromCurrency = null
    state.toCurrency = null
  },
  SET_AMOUNT (state, amount) {
    state.amount = amount
  },
  SET_FROM_CURRENCY (state, fromCurrency) {
    state.fromCurrency = fromCurrency
  },
  SET_TO_CURRENCY (state, toCurrency) {
    state.toCurrency = toCurrency
  },
  SET_VALUE_FOR_ONE (state, valueForOne) {
    state.valueForOne = valueForOne
  },
  SET_VALUE_FOR_WHOLE_AMOUNT (state, valueForWholeAmount) {
    state.valueForWholeAmount = valueForWholeAmount
  },
}
