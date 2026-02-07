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

<script setup lang="ts">
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {computed} from 'vue'
import {format} from 'date-fns'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import cashRegisterLimit from 'components/cashRegisterLimit/cashRegisterLimit'

interface Props {
  input: CashRegisterLimitInputFields
}

const props = defineProps<Props>()

const result = computed(() => {
  try {
    return cashRegisterLimit.getResult(props.input)
  }
  catch {
    return {
      amount: 0,
      daysToEndYear: 0,
      startDate: null,
    }
  }
})

const formatDate = (date:Date|null) => {
  if (!date) {
    return null
  }
  return format(date, 'dd.MM.yyyy')
}
</script>
