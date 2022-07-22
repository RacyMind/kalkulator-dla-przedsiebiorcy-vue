import axios from 'axios'
export default {
  loadExchangeRateCurrency (code:string, startDate:string, endDate:string) {
    return axios.get(`https://api.nbp.pl/api/exchangerates/rates/a/${code}/${startDate}/${endDate}`)
  },
  loadExchangeRatesFromDate (date:string) {
    return axios.get(`https://api.nbp.pl/api/exchangerates/tables/a/${date}`)
  },
  loadLatestExchangeRates () {
    return axios.get('https://api.nbp.pl/api/exchangerates/tables/a')
  },
}
