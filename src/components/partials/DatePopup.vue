<template>
  <q-popup-proxy
    ref="qDateProxyRef"
    class="no-shadow bg-transparent">
    <q-date
      v-model="date"
      mask="DD.MM.YYYY"
      :locale="polishLocalisation"
      @update:model-value="changeDate"
    >
    </q-date>
  </q-popup-proxy>
</template>

<script lang="ts">
import {ref, toRefs, watch} from 'vue'

const polishLocalisation = {
  days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
  daysShort: 'niedz._pon._wt._śr._czw._pt._sob.'.split('_'),
  months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień_Cały rok'.split('_'),
  monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
  firstDayOfWeek: 1,
}
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  setup(props: any, context: any) {
    const {modelValue} = toRefs(props)
    const date = ref(modelValue.value)
    const qDateProxyRef = ref(null) as any

    watch(modelValue, () => {
      date.value = modelValue.value
    })

    const changeDate = () => {
      qDateProxyRef.value.hide()
      context.emit('update:modelValue', date.value)
    }

    return {
      polishLocalisation,
      date,
      qDateProxyRef,
      changeDate,
    }
  },
}
</script>
