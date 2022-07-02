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
import {PropType, computed, defineComponent} from 'vue'
import {UnregisteredCompanyInputFields} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyInputFields'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/PieChart.vue'
import unregisteredCompany from 'components/unregisteredCompany/unregisteredCompany'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<UnregisteredCompanyInputFields>,
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
      chartData,
      result,
    }
  },
})
</script>
