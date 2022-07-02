<template>
  <div>
    <ListRow
      name="Kwota"
      :value="pln(result.amount)"
    />
    <ListRow
      class="bg-teal-1"
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

<script lang="ts">
import {InterestInputFields} from 'components/interest/interfaces/InterestInputFields'
import {PropType, computed, defineComponent} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import interest from 'components/interest/interest'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<InterestInputFields>,
    },
  },
  setup(props: any) {
    const result = computed(() => {
      return interest.getResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
})
</script>
