<template>
  <div>
    <ListRow
      name="Przychód"
      :value="pln(result.grossIncomeAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Koszty przychodu"
      :value="pln(result.expenses)"
    />
    <ListRow
      name="Podstawa opodatkowania"
      :value="pln(result.basicTaxAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Zaliczka na podatek dochodowy"
      :value="pln(result.taxAmount)"
    />
    <ListRow
      class="bg-primary text-white"
      name="Dochód netto"
      :value="pln(result.netIncomeAmount)"
    />
  </div>
</template>
<script lang="ts">
import {computed, PropType, toRefs, Ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import { pln } from 'src/use/currencyFormat'
import unregisteredCompany from './unregisteredCompany'
import {UnregisteredCompanyInputFields} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyInputFields'
import ListRow from 'components/partials/ListRow.vue'
import {UnregisteredCompanyResult} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyResult'

export default {
  props: {
    input: {
      type: Object as PropType<UnregisteredCompanyInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const $q = useQuasar()
    const limitForUnregisteredCompany:number = constants.MINIMUM_SALARY / 2

    const { input } = toRefs(props)

    const result: Readonly<Ref<Readonly<UnregisteredCompanyResult>>> = computed<UnregisteredCompanyResult>(() => {
      return unregisteredCompany.getResult(input.value)
    })

    watch(result, () => {
      if (result.value.netIncomeAmount > limitForUnregisteredCompany) {
        $q.notify({
          message: `Przekroczono limit przychodu (${pln(limitForUnregisteredCompany)})  dla działalności niezarejestrowanej.`,
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
