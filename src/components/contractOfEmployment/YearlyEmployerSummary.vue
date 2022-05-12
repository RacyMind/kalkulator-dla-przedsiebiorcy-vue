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
import employerContractOfEmployment from 'components/contractOfEmployment/employerContractOfEmployment'
import {ContractOfEmploymentEmployerSingleResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployerSingleResult'
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'

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
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.grossAmount,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'accident',
    label: 'Skł. wypadkowa',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.accidentContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'disability',
    label: 'Skł. rentowa',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.disabilityContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'pension',
    label: 'Skł. emerytalna',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.pensionContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'fp',
    label: 'Skł. na FP',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.fpContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'fgsp',
    label: 'Skł. na FGŚP',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.fgspContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'ppk',
    label: 'Skł. PPK',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.ppkContribution,
    format: (val:number) => `${pln(val)}`,
  },
  {
    name: 'totalAmount',
    label: 'Suma kosztów pracodawcy',
    required: true,
    align: 'left',
    field: (row:ContractOfEmploymentEmployerSingleResult) => row.totalAmount,
    format: (val:number) => `${pln(val)}`,
  },
]

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfEmploymentInputFields>,
      required: true,
    },
  },
  setup (props) {
    const $q = useQuasar()

    const monthlyInputs:Ref<ContractOfEmploymentInputFields[]> = ref([])

    for(let i = 0; i < 12; i++) {
      monthlyInputs.value.push(JSON.parse(JSON.stringify(props.input)))
    }

    const updateGrossAmounts = (grossAmounts:number[]) => {
      grossAmounts.forEach((grossAmount, index) => {
        monthlyInputs.value[index].grossAmount = grossAmount
      })
    }

    const result = computed(() => {
      employerContractOfEmployment.setParams(props.input.year)
      return employerContractOfEmployment.getYearlyResult(monthlyInputs.value)
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
