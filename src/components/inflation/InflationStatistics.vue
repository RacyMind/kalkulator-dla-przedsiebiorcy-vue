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

<script lang="ts">
import {InflationEntry} from 'components/inflation/interfaces/InflationEntry'
import {computed, defineComponent, ref, watch} from 'vue'
import {useLineChart} from 'src/use/useLineChart'
import LineChart from 'components/partials/LineChart.vue'
import constants from 'src/logic/constants'
import inflation from './inflation'

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

export default defineComponent({
  components: {
    LineChart,
  },
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
      availableYears,
      chartData,
      chartOptions,
      labels,
      loading,
      values,
      year,
    }
  },
})
</script>
