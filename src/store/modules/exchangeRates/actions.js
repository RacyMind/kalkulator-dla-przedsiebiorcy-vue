import axios from 'axios'
export default {
  loadLatestExchangeRates ({ commit }) {
    commit('SET_LOADING', true)
    axios.get('https://api.nbp.pl/api/exchangerates/tables/a/?format=json')
      .then(function (response) {
        commit('SET_DATE', response.data[0].effectiveDate)
        commit('SET_RATES', response.data[0].rates)
      })
      .finally(function () {
        commit('SET_LOADING', false)
      })
  },
}
