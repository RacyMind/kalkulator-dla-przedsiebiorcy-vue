export default {
  SET_AMOUNT (state, amount) {
    state.amount = amount
  },
  SET_BASIC (state, basic) {
    state.basic = basic
  },
  SET_DAYS (state, days) {
    state.days = days
  },
  CLEAR_DATA (state) {
    state.amount = null
    state.basic = null
    state.days = 0
  },
}
