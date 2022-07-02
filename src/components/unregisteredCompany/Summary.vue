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
import {computed, PropType, watch, defineComponent} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'
import { pln } from 'src/use/currencyFormat'
import unregisteredCompany from './unregisteredCompany'
import {UnregisteredCompanyInputFields} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyInputFields'
import ListRow from 'components/partials/ListRow.vue'
import helpers from 'src/logic/helpers'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<UnregisteredCompanyInputFields>,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const result = computed(() => {
      return unregisteredCompany.getResult(props.input)
    })

    const currentYear = helpers.getDefaultYear()
    const limitForUnregisteredCompany = constants.PARAMS[currentYear].MINIMUM_SALARY / 2

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
})
</script>
