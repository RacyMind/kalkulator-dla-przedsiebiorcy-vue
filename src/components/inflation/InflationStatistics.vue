<template>
  <div class="q-pa-md">
    <q-select
      v-model="year"
      :options="availableYears"
      label="Okres*"
      color="brand"
      class="q-mb-md"
      emit-value
      map-options
    />
    <div v-if="loading">
      Wczytywanie...
    </div>
    <template v-else-if="values.length">
      <p>
        {{ labels[labels.length - 1] }}: {{ values[values.length - 1].y }}%
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
        href="https://stat.gov.pl/obszary-tematyczne/ceny-handel/wskazniki-cen/wskazniki-cen-towarow-i-uslug-konsumpcyjnych-pot-inflacja-/miesieczne-wskazniki-cen-towarow-i-uslug-konsumpcyjnych-od-1982-roku/"
        target="_blank">GUS</a>
    </p>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue'
import constants from 'src/logic/constants'
import LineChart from '../LineChart.vue'
import inflation from './inflation'
import {useLineChart} from 'src/use/useLineChart'
import {InflationEntry} from 'components/inflation/interfaces/InflationEntry'

const chartOptions = {
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
}

export default defineComponent({
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
    const year = ref(availableYears[0].value)
    const loading = ref(false)
    const labels = ref([])
    const values = ref([])

    const chartData = computed(() => useLineChart(
        'Inflacja',
        labels.value,
        values.value,
      ),
    )

    const fetchData = () => {
      loading.value = true
      inflation.fetchInflationRates(year.value).then(response => {
        labels.value = response.map((data: InflationEntry) => {
          return `${constants.LOCALE_DATE.months[data.month - 1]} ${data.year}`
        })
        values.value = response.map((data: InflationEntry) => {
          return {
            x: new Date(`${data.year}-${data.month}-01`),
            y: data.value,
          }
        })
      }).finally(() => {
        loading.value = false
      })
    }

    fetchData()

    watch(year, () => {
      fetchData()
    })

    return {
      chartOptions,
      year,
      availableYears,
      chartData,
      labels,
      values,
      loading,
    }
  },
  components: {
    LineChart,
  },
})
</script>
