<template>
  <div class="q-pa-md">
    <q-select
      v-model="year"
      :options="availableYears"
      label="Okres*"
      color="brand"
      class="q-mb-md"
    />
    <div v-if="loading">
      Wczytywanie...
    </div>
    <template v-else-if="rates.length">
      <p>
        {{ dates[dates.length - 1] }}: {{ rates[rates.length - 1].y }}%
      </p>
      <LineChart
        :chart-options="chartOptions"
        :chart-data="chartData"/>
    </template>
    <span v-else>Brak danych</span>
    <p
      class="q-mt-md q-mb-none text-grey text-justify"
      style="font-size:0.8rem;">
      Wykres pokazuje zmianę cen w porównaniu z analogicznym miesiącem poprzedniego roku.<br><br>
      Źródło danych: <a
        class="text-grey"
        href="https://dane.gov.pl/pl/dataset/2055,miesieczne-wskazniki-cen-towarow-i-uslug-konsumpcy/resource/33666"
        target="_blank">dame.gov.pl</a><br>
      Licencja: <a
        class="text-grey"
        href="https://creativecommons.org/licenses/by/4.0/legalcode.pl"
        target="_blank">CC BY 4.0</a>
    </p>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { colors } from 'quasar'
import constants from 'src/logic/constants'
import LineChart from '../LineChart'
export default {
  setup () {
    const currentYear = new Date().getFullYear()
    const availableYears = [
      {
        label: 'Ostatnie 5 lat',
        value: currentYear - 5,
      },
      {
        label: 'Ostatnie 10 lat',
        value: currentYear - 10,
      },
      {
        label: 'Ostatnie 20 lat',
        value: currentYear - 20,
      },
    ]
    const year = ref(availableYears[0])
    return {
      year,
      availableYears,
    }
  },
  data () {
    return {
      dates: [],
      rates: [],
      loading: false,
      chartOptions: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Inflacja w %',
            },
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'quarter',
            },
          }],
        },
      },
    }
  },
  created () {
    this.loadData()
  },
  computed: {
    chartData () {
      return {
        labels: this.dates,
        datasets: [{
          label: 'Inflacja',
          data: this.rates,
          fill: false,
          borderColor: colors.lighten(constants.COLORS.INFORMATOR, -20),
        }],
      }
    },
  },
  watch: {
    year () {
      this.loadData()
    },
  },
  methods: {
    loadData () {
      this.loading = true
      axios.get(`https://kalkulatorfinansowy.app/inflation.php?year=${this.year.value}`).then(response => {
        const data = response.data.sort((a, b) => {
          return a.rok - b.rok || a.miesiac - b.miesiac
        })
        this.dates = data.map(data => {
          return `${constants.LOCALE_DATE.months[data.miesiac - 1]} ${data.rok}`
        })
        this.rates = data.map(data => {
          return {
            x: new Date(`${data.rok}-${data.miesiac}`),
            y: data.wartosc,
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
  },
  components: {
    LineChart,
  },
}
</script>
