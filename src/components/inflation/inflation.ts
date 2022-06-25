import axios from 'axios'
import {InflationApiResponse} from 'components/inflation/interfaces/InflationApiResponse'

export default {
  fetchInflationRates(fromYear:number, mode = '') {
    return axios.get(`https://kalkulatorfinansowy.app/inflation.php?year=${fromYear}&mode=${mode}`).then(response => {
      const data = response.data.sort((a:InflationApiResponse, b:InflationApiResponse) => {
        return a.rok - b.rok || a.miesiac - b.miesiac
      })
      return data.map((data:InflationApiResponse) => {
        return {
          year: data.rok,
          month: data.miesiac,
          value: parseFloat(data.wartosc),
        }
      })
    })
  },
}
