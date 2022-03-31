<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netIncomeAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import unregisteredCompany from 'components/unregisteredCompany/unregisteredCompany'
import PieChart from 'components/PieChart.vue'
import {UnregisteredCompanyInputFields} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyInputFields'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<UnregisteredCompanyInputFields>,
      required: true,
    },
  },
  setup(props) {
    const labels:string[] =  [
      'Dochód netto',
      'Zaliczka na podatek dochodowy',
    ]

    const result = computed(() => {
      return unregisteredCompany.getResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.netIncomeAmount,
          result.value.taxAmount,
        ],
      ),
    )

    return {
      result,
      chartData,
    }
  },
  components: {
    PieChart,
  },
})
</script>
