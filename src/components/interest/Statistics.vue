<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.amount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {PropType, computed, defineComponent} from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'
import interest from 'components/interest/interest'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<InterestInputFields>,
    },
  },
  setup(props) {
    const labels:string[] =  [
      'Kwota',
      'Odsetki',
    ]

    const result = computed(() => interest.getResult(props.input))

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.amount,
          result.value.interestAmount,
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
