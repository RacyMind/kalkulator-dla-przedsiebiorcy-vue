<template>
  <div>
    <ListRow
      name="Wynagrodzenie brutto"
      :value="pln(result.grossAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Koszty przychodu"
      :value="pln(result.expenses)"
    />
    <ListRow
      name="Podstawa opodatkowania"
      :value="pln(result.basisForTax)"
    />
    <ListRow
      class="bg-teal-1"
      name="Zaliczka na podatek dochodowy"
      :value="pln(result.taxAmount)"
    />
    <ListRow
      name="Składki ZUS"
      :value="pln(result.contributionTotal)"
    />
    <ListRow
      class="bg-teal-1"
      name="Składka zdrowotna"
      :value="pln(result.healthContribution)"
      nested
    />
    <ListRow
      name="Składka chorobowa"
      :value="pln(result.sickContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka rentowa"
      :value="pln(result.disabilityContribution)"
      nested
    />
    <ListRow
      name="Składka emerytalna"
      :value="pln(result.pensionContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka PPK"
      :value="pln(result.ppkContribution)"
      nested
    />
    <ListRow
      class="bg-primary text-white"
      name="Wynagrodzenie netto"
      :value="pln(result.netAmount)"
    />
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, PropType, watch} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import {pln} from 'src/use/currencyFormat'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import employeeContractOfMandate from 'components/contractOfMandate/employeeContractOfMandate'
import ListRow from 'components/partials/ListRow.vue'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractOfMandateInputFields>,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const result = computed(() => {
      employeeContractOfMandate.setParams(props.input.year)
      return employeeContractOfMandate.getMonthlyResult(props.input)
    })

    watch(result, () => {
      if (props.input.grossAmount && result.value.grossAmount <= constants.PARAMS[props.input.year].LUMP_SUM_UP_TO_AMOUNT) {
        $q.notify({
          message: `Dla wynagrodzenia brutto do ${pln(constants.PARAMS[props.input.year].LUMP_SUM_UP_TO_AMOUNT)} płaci się podatek zryczałtowany.`,
        })
      }
    })

    watch(result, () => {
      if (result.value.basisForTax > constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD) {
        $q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${pln(constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD)}). Dla kwoty powyżej progu stawka podatku wynosi ${constants.PARAMS[props.input.year].TAX_RATES.SECOND_RATE}%.`,
        })
      }
    })

    return {
      pln,
      result,
    }
  },
})
</script>
