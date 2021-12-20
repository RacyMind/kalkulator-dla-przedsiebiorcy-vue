<template>
  <div>
    <ListRow
      name="Data rozpoczęcia sprzedaży"
      :value="formatDate(result.startDate)"
    />
    <ListRow
      class="bg-teal-1"
      name="Liczba dni sprzedaży do końca roku"
      :value="result.daysToEndYear"
    />
    <ListRow
      class="bg-primary text-white"
      name="Limit obrotu uprawniający do zwolnienia"
      :value="pln(result.amount)"
    />
  </div>
</template>

<script lang="ts">
import {computed, PropType, Ref, toRefs} from 'vue'
import { format } from 'date-fns'
import { pln } from 'src/use/currencyFormat'
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import cashRegisterLimit from 'components/cashRegisterLimit/cashRegisterLimit'
import {CashRegisterLimitResult} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitResult'
import ListRow from 'components/partials/ListRow.vue'

export default {
  props: {
    input: {
      type: Object as PropType<CashRegisterLimitInputFields>,
      required: true,
    },
  },
  setup (props:any) {
    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<CashRegisterLimitResult>>> = computed(() => {
      try{
        return cashRegisterLimit.getResult(input.value)
      }
      catch{
        return {
          startDate: null,
          daysToEndYear: 0,
          amount: 0,
        }
      }
    })

    const formatDate = (date:Date|null) => {
      if (!date) {
        return null
      }
      return format(date, 'dd.MM.yyyy')
    }

    return {
      result,
      pln,
      formatDate,
    }
  },
  components: {
    ListRow,
  },
}
</script>
