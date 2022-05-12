<template>
  <div class="q-pa-md">
    <div class="row justify-between">
      <div class="col-12 col-md-6 q-pr-md-sm">
        <q-input
          v-model.number="amount"
          debounce="1000"
          type="number"
          min="0"
          step="0.01"
          label="Kwota*"
          suffix="zł"
          autofocus
          color="brand"
          :rules="[validationRules.requiredAmount]"
          lazy-rules
        />
      </div>
      <div class="col-12 col-md-6 q-pl-md-sm">
        <q-select
          v-model="year"
          :options="availableYears"
          label="Okres*"
          color="brand"
          class="q-mb-md"
          emit-value
          map-options
        />
      </div>
    </div>
    <div v-if="loading">
      Wczytywanie...
    </div>
    <template v-else-if="values.length">
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
import helpers from 'src/logic/helpers'
import validationRules from 'src/logic/validationRules'
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
        labelString: 'Siła nabywcza pieniądza w zł',
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
        label: 'Ostatni rok',
        value: currentYear - 1,
      },
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
    const amount = ref(10000)
    const year = ref(availableYears[0].value)
    const loading = ref(false)
    const labels = ref([])
    const values = ref([])

    const chartData = computed(() => useLineChart(
        'Kwota',
        labels.value,
        values.value,
      ),
    )

    const fetchData = () => {
      loading.value = true
      inflation.fetchInflationRates(year.value, 'lastMonth').then(response => {
        labels.value = response.map((data: InflationEntry) => {
          return `${constants.LOCALE_DATE.months[data.month - 1]} ${data.year}`
        })

        let currentValue = amount.value

        values.value = response.map((data: InflationEntry) => {
          currentValue = currentValue - currentValue * data.value/100
          return {
            x: new Date(`${data.year}-${data.month}-01`),
            y: helpers.round(currentValue, 2),
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

    watch(amount, () => {
      fetchData()
    })

    return {
      validationRules,
      chartOptions,
      amount,
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
