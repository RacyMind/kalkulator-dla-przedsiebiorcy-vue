import {InflationApiResponse} from 'components/inflation/interfaces/InflationApiResponse'
import axios from 'axios'

export default {
  fetchInflationRates(fromYear:number, mode = '') {
    return axios.get(`https://kalkulatorfinansowy.app/inflation.php?year=${fromYear}&mode=${mode}`).then(response => {
      const data = response.data.sort((a:InflationApiResponse, b:InflationApiResponse) => {
        return a.rok - b.rok || a.miesiac - b.miesiac
      })
      return data.map((data:InflationApiResponse) => {
        return {
          month: data.miesiac,
          value: parseFloat(data.wartosc),
          year: data.rok,
        }
      })
    })
  },
}
