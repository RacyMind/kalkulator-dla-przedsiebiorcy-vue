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

<script lang="ts">
import {PropType, computed, defineComponent} from 'vue'
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import { format } from 'date-fns'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import vatLimit from 'components/vatLimit/vatLimit'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<VatLimitInputFields>,
    },
  },
  setup (props) {
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

    return {
      formatDate,
      pln,
      result,
    }
  },
})
</script>
