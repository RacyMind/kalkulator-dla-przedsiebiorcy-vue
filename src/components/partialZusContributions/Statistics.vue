<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.contributionTotal && input.daysOfRunningBusiness"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import PieChart from 'components/PieChart.vue'
import partialZusContributions from 'components/partialZusContributions/partialZusContributions'
import {usePieChart} from 'src/use/usePieChart'
import {PartialZusContributionInputFields} from 'components/partialZusContributions/interfaces/PartialZusContributionInputFields'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<PartialZusContributionInputFields>,
      required: true,
    },
  },
  setup(props) {
    const labels =  [
      'Składka chorobowa',
      'Składka rentowa',
      'Składka emerytalna',
      'Składka wypadkowa',
      'Składka na Fundusz Pracy',
    ]

    const result = computed(() => {
      return partialZusContributions.getResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.sickContribution,
          result.value.disabilityContribution,
          result.value.pensionContribution,
          result.value.accidentContribution,
          result.value.fpContribution,
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
