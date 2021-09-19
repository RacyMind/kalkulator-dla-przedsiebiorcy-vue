import axios from 'axios'

export default {
  loadLatestExchangeRates ({ commit }) {
    commit('setLoading', true)
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
    return axios.get(`http://api.nbp.pl/api/exchangerates/rates/a/${code}/${startDate}/${endDate}`)
  },
}
