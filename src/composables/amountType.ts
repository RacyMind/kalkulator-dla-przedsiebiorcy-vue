import {AmountTypes} from 'src/composables/constants'
import {ref, watch} from 'vue'
import {useQuasar} from 'quasar'

export const useAmmmountType = () => {
  const $q = useQuasar()

  const amountType = ref(AmountTypes.Gross)

  watch(amountType, () => {
    if (amountType.value === AmountTypes.Net) {
      $q.notify({
        message: 'Przy wynagrodzeniu netto obliczenia są szacunkowe. Zalecane jest korzystanie z wynagroodzenia brutto, by poznać dokładne obliczenia.',
      })
    }
  })

  return amountType
}
