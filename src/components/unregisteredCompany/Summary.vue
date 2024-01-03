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
import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {PropType, computed, defineComponent, watch} from 'vue'
import { pln } from 'src/use/currencyFormat'
import {useQuasar} from 'quasar'
import ListRow from 'components/partials/ListRow.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import unregisteredCompany from './unregisteredCompany'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<InputFields>,
    },
  },
  setup(props) {
    const $q = useQuasar()

    const result = computed(() => {
      return unregisteredCompany.getResult(props.input)
    })

    const currentYear = helpers.getDefaultYear()
    let minnimumSalary = constants.PARAMS[currentYear].MINIMUM_SALARY
    if(typeof minnimumSalary === 'object') {
      minnimumSalary = new Date().getMonth() <= 5 ? minnimumSalary.FISRT_HALF_OF_YEAR : minnimumSalary.SECOND_HALF_OF_YEAR
    }
    const limitForUnregisteredCompany = minnimumSalary / 2

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
