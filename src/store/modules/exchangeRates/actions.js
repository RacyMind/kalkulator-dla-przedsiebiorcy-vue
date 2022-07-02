import axios from 'axios'

export default {
  loadExchangeRateCurrency ({  }, { code, startDate, endDate }) {
    return axios.get(`https://api.nbp.pl/api/exchangerates/rates/a/${code}/${startDate}/${endDate}`)
  },
  loadExchangeRatesFromDate ({  }, { date }) {
    return axios.get(`https://api.nbp.pl/api/exchangerates/tables/a/${date}`)
  },
  loadLatestExchangeRates () {
    return axios.get('https://api.nbp.pl/api/exchangerates/tables/a')
  },
}
