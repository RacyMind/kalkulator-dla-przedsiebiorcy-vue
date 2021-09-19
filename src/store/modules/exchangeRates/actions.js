import axios from 'axios'

export default {
  loadLatestExchangeRates ({ commit }) {
    commit('SET_LOADING', true)
    axios.get('https://api.nbp.pl/api/exchangerates/tables/a/?format=json')
      .then(function (response) {
        commit('setDate', response.data[0].effectiveDate)
        commit('setRates', response.data[0].rates)
      })
      .catch(() => {
        commit('setRates', [])
      })
      .finally(function () {
        commit('setLoading', false)
      })
  },
  loadExchangeRateCurrency ({ commit }, { code, startDate, endDate }) {
    commit('setLoading', true)
    axios.get(`http://api.nbp.pl/api/exchangerates/rates/a/${code}/${startDate}/${endDate}`)
      .then(function (response) {
        commit('setCurrency', response.data)
      })
      .catch(() => {
        commit('setCurrency', null)
      })
      .finally(function () {
        commit('setLoading', false)
      })
  },
}
