import {AmountTypes} from 'src/composables/constants'
import {ref, watch} from 'vue'
import {useLocalStorage} from '@vueuse/core'
import {useQuasar} from 'quasar'

export const useAmmmountType = (storagePrefix = '') => {
  const $q = useQuasar()

  const amountType = useLocalStorage(`${storagePrefix}/amountType`, AmountTypes.Gross, { mergeDefaults: true })

  watch(amountType, () => {
    if (amountType.value === AmountTypes.Net) {
      $q.notify({
        message: 'Przy wynagrodzeniu netto obliczenia są szacunkowe. Zalecane jest korzystanie z wynagroodzenia brutto, by poznać dokładne obliczenia.',
      })
    }
  })

  return amountType
}
