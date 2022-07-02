<template>
  <div>
    <ListRow
      name="Podstawa wymiaru świadczenia"
      :value="pln(result.basicAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Liczba dni"
      :value="input.dayCount"
    />
    <ListRow
      class="bg-primary text-white"
      name="Zasiłek chorobowy"
      :value="pln(result.sickPayAmount)"
    />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import sickPay from 'components/sickPay/sickPay'
import {SickPayInputFields} from 'components/sickPay/interfaces/SickPayInputFields'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<SickPayInputFields>,
    },
  },
  setup(props) {
    const result = computed(() => {
      return sickPay.getResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
})
</script>
