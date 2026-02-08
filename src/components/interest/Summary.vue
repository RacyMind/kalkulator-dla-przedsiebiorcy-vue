<template>
  <div>
    <ListRow
      name="Kwota"
      :value="pln(result.amount)"
    />
    <ListRow
      class="bg-surface-elevated"
      name="Odsetki"
      :value="pln(result.interestAmount)"
    />
    <ListRow
      name="Liczba dni"
      :value="result.dayCount"
    />
    <ListRow
      class="bg-primary text-white"
      name="Suma kwoty i odsetek"
      :value="pln(result.amount + result.interestAmount)"
    />
  </div>
</template>

<script setup lang="ts">
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {computed} from 'vue'
import {pln} from 'src/composables/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import interest from 'components/interest/interest'

interface Props {
  input: InterestInputFields
}

const props = defineProps<Props>()

const result = computed(() => {
  return interest.getResult(props.input)
})
</script>
