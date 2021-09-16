export default {
  setAmount (state, amount) {
    state.amount = amount
  },
  setAmountType (state, amountType) {
    state.amountType = amountType
  },
  setTaxRate (state, taxRate) {
    state.taxRate = taxRate
  },
  clearAllData (state) {
    state.amount = null
    state.amountType = null
    state.taxRate = null
  },
}
