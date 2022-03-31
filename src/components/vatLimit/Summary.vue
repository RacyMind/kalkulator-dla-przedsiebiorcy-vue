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
import {computed, defineComponent, PropType} from 'vue'
import { format } from 'date-fns'
import { pln } from 'src/use/currencyFormat'
import vatLimit from 'components/vatLimit/vatLimit'
import ListRow from 'components/partials/ListRow.vue'
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<VatLimitInputFields>,
      required: true,
    },
  },
  setup (props) {
    const result = computed(() => {
      try {
        return vatLimit.getResult(props.input)
      }
      catch {
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
})
</script>
