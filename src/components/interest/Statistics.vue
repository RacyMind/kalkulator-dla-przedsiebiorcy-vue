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
import {computed, defineComponent, PropType} from 'vue'
import PieChart from 'components/PieChart.vue'
import interest from 'components/interest/interest'
import {usePieChart} from 'src/use/usePieChart'
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<InterestInputFields>,
      required: true,
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
      result,
      chartData,
    }
  },
  components: {
    PieChart,
  },
})
</script>
