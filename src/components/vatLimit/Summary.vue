<template>
  <div>
    <ListRow
      name="Data rozpoczęcia działalności"
      :value="formatDate(result.startDate)"
    />
    <ListRow
      class="bg-teal-1"
      name="Liczba dni działalności do końca roku"
      :value="result.daysToEndYear"
    />
    <ListRow
      class="bg-primary text-white"
      name="Limit przychodu uprawniający do zwolnienia"
      :value="pln(result.amount)"
    />
  </div>
</template>

<script setup lang="ts">
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {computed} from 'vue'
import {format} from 'date-fns'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import vatLimit from 'components/vatLimit/vatLimit'

interface Props {
  input: VatLimitInputFields
}

const props = defineProps<Props>()

const result = computed(() => {
  try {
    return vatLimit.getResult(props.input)
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
