<template>
  <YearlySummaryTable
    title="Podsumowanie dla pracodawcy"
    :columns="columns"
    :rows="totalResult"
    @grossAmountUpdated="updateGrossAmounts"
  />
</template>

<script lang="ts">
import {ContractOfMandateEmployerSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployerSingleResult'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import {PropType, Ref, computed, defineComponent, ref, watch} from 'vue'
import { pln } from 'src/use/currencyFormat'
import {useQuasar} from 'quasar'
import YearlySummaryTable from 'components/partials/YearlySummaryTable.vue'
import constants from 'src/logic/constants'
import employerContractOfMandate from 'components/contractOfMandate/employerContractOfMandate'

const columns =  [
  {
    align: 'left',
    field: () => '',
    format: (val:string) => `${val}`,
    name: 'month',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.grossAmount,
    format: (val:number) => `${pln(val)}`,
    label: 'Wynagrodzenie brutto',
    name: 'gross',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.accidentContribution,
    format: (val:number) => `${pln(val)}`,
    label: 'Skł. wypadkowa',
    name: 'accident',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.disabilityContribution,
    format: (val:number) => `${pln(val)}`,
    label: 'Skł. rentowa',
    name: 'disability',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.pensionContribution,
    format: (val:number) => `${pln(val)}`,
    label: 'Skł. emerytalna',
    name: 'pension',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.fpContribution,
    format: (val:number) => `${pln(val)}`,
    label: 'Skł. na FP',
    name: 'fp',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.fgspContribution,
    format: (val:number) => `${pln(val)}`,
    label: 'Skł. na FGŚP',
    name: 'fgsp',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.ppkContribution,
    format: (val:number) => `${pln(val)}`,
    label: 'Skł. PPK',
    name: 'ppk',
    required: true,
  },
  {
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.totalAmount,
    format: (val:number) => `${pln(val)}`,
    label: 'Suma kosztów pracodawcy',
    name: 'totalAmount',
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
      type: Object as PropType<InputFields>,
    },
  },
  setup (props) {
    const $q = useQuasar()

    const monthlyInputs:Ref<InputFields[]> = ref([])

    for(let i = 0; i < 12; i++) {
      monthlyInputs.value.push(JSON.parse(JSON.stringify(props.input)))
    }

    const updateGrossAmounts = (grossAmounts:number[]) => {
      grossAmounts.forEach((grossAmount, index) => {
        monthlyInputs.value[index].grossAmount = grossAmount
      })
    }

    const result = computed(() => {
      employerContractOfMandate.setParams(props.input.year)
      return employerContractOfMandate.getYearlyResult(monthlyInputs.value)
    })

    watch(result, () => {
        if (result.value.yearlyResult.basisForRentAndPensionContributions >= constants.PARAMS[props.input.year].LIMIT_BASIC_AMOUNT_FOR_ZUS) {
          $q.notify({
            message: `Osiągnięto limit 30-krotności składek ZUS (${pln(constants.PARAMS[props.input.year].LIMIT_BASIC_AMOUNT_FOR_ZUS)}). Powyżej limitu nie ma obowiązku opłacania składki emerytalnej i rentowej.`,
          })
        }
      },
      {
        immediate: true,
      },
    )

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
