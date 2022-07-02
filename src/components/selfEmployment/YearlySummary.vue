<template>
  <YearlySummaryTable
    title="Podsumowanie"
    :columns="columns"
    :rows="totalResult"
    @grossAmountUpdated="updateGrossAmounts"
  />
</template>

<script lang="ts">
import {computed, defineComponent, PropType, watch, ref, Ref} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import {pln} from 'src/use/currencyFormat'
import selfEmployment from 'components/selfEmployment/selfEmployment'
import YearlySummaryTable from 'components/partials/YearlySummaryTable.vue'
import {SelfEmploymentSingleResult} from 'components/selfEmployment/interfaces/SelfEmploymentSingleResult'
import {SelfEmploymentInputFields} from 'components/selfEmployment/interfaces/SelfEmploymentInputFields'

const columns = [
  {
    align: 'left',
    field: () => '',
    format: (val: string) => `${val}`,
    name: 'month',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.grossAmount,
    format: (val: number) => `${pln(val)}`,
    label: 'Przychód netto',
    name: 'gross',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.sickContribution,
    format: (val: number) => `${pln(val)}`,
    label: 'Skł. chorobowa',
    name: 'sick',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.disabilityContribution,
    format: (val: number) => `${pln(val)}`,
    label: 'Skł. rentowa',
    name: 'disability',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.pensionContribution,
    format: (val: number) => `${pln(val)}`,
    label: 'Skł. emerytalna',
    name: 'pension',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.healthContribution,
    format: (val: number) => `${pln(val)}`,
    label: 'Skł. zdrowotna',
    name: 'health',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.accidentContribution,
    format: (val: number) => `${pln(val)}`,
    label: 'Skł. wypadkowa',
    name: 'accident',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.fpContribution,
    format: (val: number) => `${pln(val)}`,
    label: 'Skł. na Fundusz Pracy',
    name: 'fp',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.taxAmount,
    format: (val: number) => `${pln(val)}`,
    label: 'Zaliczka na podatek',
    name: 'taxAmount',
    required: true,
  },
  {
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.netAmount,
    format: (val: number) => `${pln(val)}`,
    label: 'Dochód netto',
    name: 'net',
    required: true,
  },
]

export default defineComponent({
  components: {
    YearlySummaryTable,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<SelfEmploymentInputFields>,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const monthlyInputs: Ref<SelfEmploymentInputFields[]> = ref([])

    for (let i = 0; i < 12; i++) {
      monthlyInputs.value.push(JSON.parse(JSON.stringify(props.input)))
    }

    const updateGrossAmounts = (grossAmounts: number[]) => {
      grossAmounts.forEach((grossAmount, index) => {
        monthlyInputs.value[index].amount = grossAmount
      })
    }

    const result = computed(() => {
      selfEmployment.setParams(props.input.year)
      return selfEmployment.getYearlyResult(monthlyInputs.value)
    })

    watch(result, () => {
      if (props.input.incomeTaxType === constants.TAX_TYPES.GENERAL && result.value.yearlyResult.basisForTax > constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD) {
        $q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${pln(constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD)}). Dla kwoty powyżej progu stawka podatku wynosi ${constants.TAX_RATES.SECOND_RATE}%.`,
        })
      }
    })

    const totalResult = computed(() => {
      return result.value.monthlyResults.concat([result.value.yearlyResult])
    })

    return {
      columns,
      constants,
      pln,
      totalResult,
      updateGrossAmounts,
    }
  },
})
</script>
