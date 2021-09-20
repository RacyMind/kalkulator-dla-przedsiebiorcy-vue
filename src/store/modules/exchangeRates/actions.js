import axios from 'axios'

export default {
  loadLatestExchangeRates () {
    return axios.get('https://api.nbp.pl/api/exchangerates/tables/a')
  },
  loadExchangeRatesFromDate ({ commit }, { date }) {
    return axios.get(`https://api.nbp.pl/api/exchangerates/tables/a/${date}`)
  },
  loadExchangeRateCurrency ({ commit }, { code, startDate, endDate }) {
    return axios.get(`https://api.nbp.pl/api/exchangerates/rates/a/${code}/${startDate}/${endDate}`)
  },
}
