<template>
  <div>
    <ListRow
      name="Przychód netto"
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
      name="Składka wypadkowa"
      :value="pln(result.accidentContribution)"
      nested
    />
    <ListRow
      name="Składka na Fundusz Pracy"
      :value="pln(result.fpContribution)"
      nested
    />
    <ListRow
      class="bg-primary text-white"
      name="Dochód netto"
      :value="pln(result.netAmount)"
    />
  </div>
</template>
<script lang="ts">
import {PropType, computed, defineComponent, watch} from 'vue'
import {SelfEmploymentInputFields} from 'components/selfEmployment/interfaces/SelfEmploymentInputFields'
import { pln } from 'src/use/currencyFormat'
import {useQuasar} from 'quasar'
import ListRow from 'src/components/partials/ListRow.vue'
import constants from 'src/logic/constants'
import selfEmployment from 'components/selfEmployment/selfEmployment'

export default defineComponent({

  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<SelfEmploymentInputFields>,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const result = computed(() => {
      selfEmployment.setParams(props.input.year)
      return selfEmployment.getMonthlyResult(props.input)
    })

    watch(result, () => {
      if (props.input.incomeTaxType === constants.TAX_TYPES.GENERAL && result.value.basisForTax > constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD) {
        $q.notify({
          message: `Podstawa opodatkowania przekroczyła granicę progu podatkowego (${pln(constants.PARAMS[props.input.year].AMOUNT_OF_TAX_THRESHOLD)}). Dla kwoty powyżej progu stawka podatku wynosi ${constants.TAX_RATES.SECOND_RATE}%.`,
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
