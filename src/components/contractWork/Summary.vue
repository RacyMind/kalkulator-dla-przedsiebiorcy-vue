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
import {computed, PropType, Ref, toRefs, watch} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import contractWork from 'components/contractWork/contractWork'
import { pln } from 'src/use/currencyFormat'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {ContractWorkResult} from 'components/contractWork/interfaces/ContractWorkResult'
import {AvailableYear} from 'src/types/AvailableYear'
import ListRow from 'components/partials/ListRow.vue'

export default {
  props: {
    input: {
      type: Object as PropType<ContractWorkInputFields>,
      required: true,
    },
  },
  setup (props:any) {
    const $q = useQuasar()

    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<ContractWorkResult>>> = computed(() => {
      try{
        return contractWork.getResult(input.value)
      }
      catch {
        return {
          basisForTax: 0,
          expenses:  0,
          grossAmount: 0,
          taxAmount: 0,
          netAmount: 0,
        }
      }
    })

    watch(result, () => {
      if (input.value.amount && result.value.grossAmount <= constants.PARAMS[<AvailableYear>input.value.year].LUMP_SUM_UP_TO_AMOUNT) {
        $q.notify({
          message: `Dla wynagrodzenia brutto do ${pln(constants.PARAMS[<AvailableYear>input.value.year].LUMP_SUM_UP_TO_AMOUNT)} płaci się podatek zryczałtowany.`,
        })
      }
      if (input.value.expenseRate === constants.CONTRACT_WORK.EXPENSES_50 && result.value.expenses >= constants.PARAMS[<AvailableYear>input.value.year].AMOUNT_OF_TAX_THRESHOLD) {
        $q.notify({
          message: `Przy 50% uzyskania kosztów przychodu obowiązuje limit kosztów w kwocie ${pln(constants.PARAMS[<AvailableYear>input.value.year].AMOUNT_OF_TAX_THRESHOLD)}.`,
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
}
</script>
