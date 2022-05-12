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
    name: 'month',
    required: true,
    align: 'left',
    field: () => '',
    format: (val: string) => `${val}`,
  },
  {
    name: 'gross',
    label: 'Przychód netto',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.grossAmount,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'sick',
    label: 'Skł. chorobowa',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.sickContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'disability',
    label: 'Skł. rentowa',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.disabilityContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'pension',
    label: 'Skł. emerytalna',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.pensionContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'health',
    label: 'Skł. zdrowotna',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.healthContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'accident',
    label: 'Skł. wypadkowa',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.accidentContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'fp',
    label: 'Skł. na Fundusz Pracy',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.fpContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'taxAmount',
    label: 'Zaliczka na podatek',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.taxAmount,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'net',
    label: 'Dochód netto',
    required: true,
    align: 'left',
    field: (row: SelfEmploymentSingleResult) => row.netAmount,
    format: (val: number) => `${pln(val)}`,
  },
]

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<SelfEmploymentInputFields>,
      required: true,
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
      pln,
      constants,
      columns,
      totalResult,
      updateGrossAmounts,
    }
  },
  components: {
    YearlySummaryTable,
  },
})
</script>
