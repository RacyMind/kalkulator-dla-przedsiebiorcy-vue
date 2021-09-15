import axios from 'axios'
export default {
  loadLatestExchangeRates ({ commit }) {
    commit('SET_LOADING', true)
    axios.get('https://api.nbp.pl/api/exchangerates/tables/a/?format=json')
      .then(function (response) {
        commit('SET_DATE', response.data[0].effectiveDate)
        commit('SET_RATES', response.data[0].rates)
      })
      .catch(() => {
        commit('SET_RATES', [])
      })
      .finally(function () {
        commit('SET_LOADING', false)
      })
  },
  loadExchangeRateCurrency ({ commit }, { code, startDate, endDate }) {
    commit('SET_LOADING', true)
    axios.get(`http://api.nbp.pl/api/exchangerates/rates/a/${code}/${startDate}/${endDate}`)
      .then(function (response) {
        commit('SET_CURRENCY', response.data)
      })
      .catch(() => {
        commit('SET_CURRENCY', null)
      })
      .finally(function () {
        commit('SET_LOADING', false)
      })
  },
}
