<template>
  <YearlySummaryTable
    title="Podsumowanie dla pracownika"
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
import employeeContractOfEmployment from 'components/contractOfEmployment/employeeContractOfEmployment'
import YearlySummaryTable from 'components/partials/YearlySummaryTable.vue'
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import {ContractOfEmploymentEmployeeSingleResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeSingleResult'

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
    label: 'Wynagrodzenie brutto',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.grossAmount,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'sick',
    label: 'Skł. chorobowa',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.sickContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'disability',
    label: 'Skł. rentowa',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.disabilityContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'pension',
    label: 'Skł. emerytalna',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.pensionContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'health',
    label: 'Skł. zdrowotna',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.healthContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'ppk',
    label: 'Skł. PPK',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.ppkContribution,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'taxAmount',
    label: 'Zaliczka na podatek',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.taxAmount,
    format: (val: number) => `${pln(val)}`,
  },
  {
    name: 'net',
    label: 'Wynagrodzenie netto',
    required: true,
    align: 'left',
    field: (row: ContractOfEmploymentEmployeeSingleResult) => row.netAmount,
    format: (val: number) => `${pln(val)}`,
  },
]

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfEmploymentInputFields>,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const monthlyInputs: Ref<ContractOfEmploymentInputFields[]> = ref([])

    for (let i = 0; i < 12; i++) {
      monthlyInputs.value.push(JSON.parse(JSON.stringify(props.input)))
    }

    const updateGrossAmounts = (grossAmounts: number[]) => {
      grossAmounts.forEach((grossAmount, index) => {
        monthlyInputs.value[index].grossAmount = grossAmount
      })
    }

    const result = computed(() => {
      employeeContractOfEmployment.setParams(props.input.year)
      return employeeContractOfEmployment.getYearlyResult(monthlyInputs.value)
    })

    watch(result, () => {
        if (result.value.yearlyResult.basisForTax > constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD) {
          $q.notify({
            message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${pln(constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD)}). Dla kwoty powyżej progu stawka podatku wynosi ${constants.TAX_RATES.SECOND_RATE}%.`,
          })
        }
        if (result.value.yearlyResult.basisForRentAndPensionContributions >= constants.PARAMS[props.input.year].LIMIT_BASIC_AMOUNT_FOR_ZUS) {
          $q.notify({
            message: `Osiągnięto limit 30-krotności składek ZUS (${pln(constants.PARAMS[props.input.year].LIMIT_BASIC_AMOUNT_FOR_ZUS)}). Powyżej limitu nie ma obowiązku opłacania składki emerytalnej i rentowej.`,
          })
        }
        if (props.input.isReliefForYoung && result.value.yearlyResult.grossAmount > constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD) {
          $q.notify({
            message: `Przekroczono próg podatkowy (${pln(constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD)}). Od nadwyżki oblicza się ${constants.TAX_RATES.FIRST_RATE}% podatku.`,
          })
        }
        if (props.input.employerPpkContributionRate) {
          $q.notify({
            message: 'Od lutego do podstawy opodatkowania doliczana jest składka PPK wpłacana przez pracodawcę.',
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
