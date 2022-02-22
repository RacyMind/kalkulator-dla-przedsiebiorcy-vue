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
import {computed, PropType, Ref, toRefs} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import sickPay from 'components/sickPay/sickPay'
import {SickPayInputFields} from 'components/sickPay/interfaces/SickPayInputFields'
import {SickPayResult} from 'components/sickPay/interfaces/SickPayResult'

export default {
  props: {
    input: {
      type: Object as PropType<SickPayInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const { input } = toRefs(props)

    const result: Readonly<Ref<Readonly<SickPayResult>>> = computed(() => {
      return sickPay.getResult(input.value)
    })

    return {
      pln,
      result,
    }
  },
  components: {
    ListRow,
  },
}
</script>
