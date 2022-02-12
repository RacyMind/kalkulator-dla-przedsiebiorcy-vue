<template>
  <YearlySummaryTable
    title="Podsumowanie dla pracodawcy"
    :columns="columns"
    :rows="totalResult"
    @grossAmountUpdated="updateGrossAmounts"
  />
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, Ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import { pln } from 'src/use/currencyFormat'
import YearlySummaryTable from 'components/partials/YearlySummaryTable.vue'
import employerContractOfMandate from 'components/contractOfMandate/employerContractOfMandate'
import {ContractOfMandateEmployerSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployerSingleResult'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'

const columns =  [
  {
    name: 'month',
    required: true,
    align: 'left',
    field: () => '',
    format: (val:string) => `${val}`,
  },
  {
    name: 'gross',
    label: 'Wynagrodzenie brutto',
    required: true,
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.grossAmount,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'accident',
    label: 'Skł. wypadkowa',
    required: true,
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.accidentContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'rent',
    label: 'Skł. rentowa',
    required: true,
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.disabilityContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'pension',
    label: 'Skł. emerytalna',
    required: true,
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.pensionContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'ppk',
    label: 'Skł. PPK',
    required: true,
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.ppkContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'totalAmount',
    label: 'Suma kosztów pracodawcy',
    required: true,
    align: 'left',
    field: (row:ContractOfMandateEmployerSingleResult) => row.totalAmount,
    format: (val:number) => `${pln(val)}`,
  },
]

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfMandateInputFields>,
      required: true,
    },
  },
  setup (props) {
    const $q = useQuasar()

    const monthlyInputs:Ref<ContractOfMandateInputFields[]> = ref([])

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
