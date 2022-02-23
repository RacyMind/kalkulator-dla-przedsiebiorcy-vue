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
      :value="pln(result.disabilityContribution)"
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
import employeeContractOfEmployment from 'components/contractOfEmployment/employeeContractOfEmployment'
import ListRow from 'components/partials/ListRow.vue'
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfEmploymentInputFields>,
      required: true,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const result = computed(() => {
      employeeContractOfEmployment.setParams(props.input.year)
      return employeeContractOfEmployment.getMonthlyResult(props.input)
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
  components: {
    ListRow,
  },
})
</script>
