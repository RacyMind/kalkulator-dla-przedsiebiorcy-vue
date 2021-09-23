export default {
  setAmount (state, amount) {
    state.amount = amount
  },
  setExpenses (state, expenses) {
    state.expenses = expenses
  },
  clearAllData (state) {
    state.amount = null
    state.expenses = null
  },
}
