export default {
  SET_BUSINESS_START_DATE (state, businessStartDate) {
    state.businessStartDate = businessStartDate
  },
  SET_DAYS_TO_END_YEAR (state, daysToEndYear) {
    state.daysToEndYear = daysToEndYear
  },
  SET_AMOUNT (state, amount) {
    state.amount = amount
  },
  CLEAR_DATA (state) {
    state.sellStartDate = null
    state.dayOfYear = null
    state.amount = null
  },
}
