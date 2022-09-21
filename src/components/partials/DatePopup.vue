<template>
  <q-popup-proxy
    ref="qDateProxyRef"
    class="no-shadow bg-transparent">
    <q-date
      v-model="date"
      :locale="polishLocalisation"
      mask="DD.MM.YYYY"
      :options="validDays"
      @update:model-value="changeDate"
    >
    </q-date>
  </q-popup-proxy>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'
import {isFuture, isWeekend, parse} from 'date-fns'

const polishLocalisation = {
  days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
  daysShort: 'niedz._pon._wt._śr._czw._pt._sob.'.split('_'),
  firstDayOfWeek: 1,
  months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień_Cały rok'.split('_'),
  monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
}
export default defineComponent({
  props: {
    modelValue: {
      required: true,
      type: String,
    },
    onlyPastOrToday: {
      defaut: false,
      required: false,
      type: Boolean,
    },
    onlyWorkDays: {
      defaut: false,
      required: false,
      type: Boolean,
    },
  },
  setup(props, context) {
    const date = ref(props.modelValue)
    const qDateProxyRef = ref(null) as any

    watch(() => props.modelValue, () => {
      date.value = props.modelValue
    })

    const changeDate = () => {
      qDateProxyRef.value.hide()
      context.emit('update:modelValue', date.value)
    }

    const validDays = (dateStr: string) => {
      const date = parse(dateStr,'y/MM/dd', new Date())

      if (props.onlyPastOrToday && isFuture(date)) {
        return false
      }
      if (props.onlyWorkDays && isWeekend(date)) {
        return false
      }
      return true
    }

    return {
      changeDate,
      date,
      polishLocalisation,
      qDateProxyRef,
      validDays,
    }
  },
})
</script>
