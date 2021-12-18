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
import {computed, PropType, Ref, toRefs} from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import {UnregisteredCompanyResult} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyResult'
import unregisteredCompany from 'components/unregisteredCompany/unregisteredCompany'
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import PieChart from 'components/PieChart.vue'

export default {
  props: {
    input: {
      type: Object as PropType<InvoiceInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const labels:string[] =  [
      'Dochód netto',
      'Zaliczka na podatek dochodowy',
    ]

    const { input } = toRefs(props)

    const result: Readonly<Ref<Readonly<UnregisteredCompanyResult>>> = computed<UnregisteredCompanyResult>(() => {
      return unregisteredCompany.getResult(input.value)
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
}
</script>
