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
      class="bg-primary text-white"
      name="Wynagrodzenie netto"
      :value="pln(result.netAmount)"
    />
  </div>
</template>
<script lang="ts">
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {PropType, computed, defineComponent, watch} from 'vue'
import { pln } from 'src/use/currencyFormat'
import {useQuasar} from 'quasar'
import ListRow from 'components/partials/ListRow.vue'
import constants from 'src/logic/constants'
import contractWork from 'components/contractWork/contractWork'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractWorkInputFields>,
    },
  },
  setup (props) {
    const $q = useQuasar()

    const result = computed(() => {
      try{
        return contractWork.getResult(props.input)
      }
      catch {
        return {
          basisForTax: 0,
          expenses:  0,
          grossAmount: 0,
          netAmount: 0,
          taxAmount: 0,
        }
      }
    })

    watch(result, () => {
      if (props.input.amount && result.value.grossAmount <= constants.PARAMS[<AvailableYear>props.input.year].LUMP_SUM_UP_TO_AMOUNT) {
        $q.notify({
          message: `Dla wynagrodzenia brutto do ${pln(constants.PARAMS[<AvailableYear>props.input.year].LUMP_SUM_UP_TO_AMOUNT)} płaci się podatek zryczałtowany.`,
        })
      }
      if (props.input.expenseRate === constants.CONTRACT_WORK.EXPENSES_50 && result.value.expenses >= constants.PARAMS[<AvailableYear>props.input.year].AMOUNT_OF_TAX_THRESHOLD) {
        $q.notify({
          message: `Przy 50% uzyskania kosztów przychodu obowiązuje limit kosztów w kwocie ${pln(constants.PARAMS[<AvailableYear>props.input.year].AMOUNT_OF_TAX_THRESHOLD)}.`,
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
