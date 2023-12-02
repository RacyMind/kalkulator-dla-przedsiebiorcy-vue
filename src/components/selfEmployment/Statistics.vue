<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount && input.amount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {PropType, computed, defineComponent} from 'vue'
import {SelfEmploymentInputFields} from 'components/selfEmployment/interfaces/SelfEmploymentInputFields'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'
import selfEmployment from 'components/selfEmployment/selfEmployment'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<SelfEmploymentInputFields>,
    },
  },
  setup(props) {
    const labels =  [
      'Dochód netto',
      'Zaliczka na podatek dochodowy',
      'Składka zdrowotna',
      'Składka chorobowa',
      'Składka rentowa',
      'Składka emerytalna',
      'Składka wypadkowa',
      'Składka na Fundusz Pracy',
    ]

    const result = computed(() => {
      return selfEmployment.getMonthlyResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.netAmount,
          result.value.taxAmount,
          result.value.healthContribution,
          result.value.sickContribution,
          result.value.disabilityContribution,
          result.value.pensionContribution,
          result.value.accidentContribution,
          result.value.fpContribution,
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
