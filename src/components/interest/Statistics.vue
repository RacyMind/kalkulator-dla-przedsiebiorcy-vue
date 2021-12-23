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
import {computed, PropType, Ref, toRefs} from 'vue'
import PieChart from 'components/PieChart.vue'
import interest from 'components/interest/interest'
import {usePieChart} from 'src/use/usePieChart'
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {InterestResult} from 'components/interest/interfaces/InterestResult'

export default {
  props: {
    input: {
      type: Object as PropType<InterestInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const labels:string[] =  [
      'Kwota',
      'Odsetki',
    ]

    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<InterestResult>>> = computed(() => interest.getResult(input.value))

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
}
</script>
