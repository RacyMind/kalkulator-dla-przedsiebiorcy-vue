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
        href="https://data.ecb.europa.eu/data/datasets/ICP/ICP.M.PL.N.000000.4.ANR"
        target="_blank">Eurostat/ECB</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import {InflationEntry} from 'components/inflation/interfaces/InflationEntry'
import {computed, ref, watch} from 'vue'
import {useLineChart} from 'src/composables/useLineChart'
import LineChart from 'components/partials/LineChart.vue'
import {useConstantsStore} from 'stores/constantsStore'
import inflation from './inflation'

const constants = useConstantsStore()

const chartOptions = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      time: {
        unit: 'quarter',
      },
      type: 'time',
    }],
      yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Inflacja w %',
      },
    }],
  },
}

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
const labels = ref<string[]>([])
const values = ref<Array<{x: Date, y: number}>>([])

const chartData = computed(() => useLineChart(
    'Inflacja',
    labels.value,
    values.value,
  ),
)

const fetchData = () => {
  loading.value = true
  inflation.fetchInflationRates(year.value).then((response: InflationEntry[]) => {
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
</script>
