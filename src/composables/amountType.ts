import {AmountType} from 'src/types/AmountType'
import {Ref, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import constants from 'src/logic/constants'

export const useAmmmountType = () => {
  const $q = useQuasar()

  const amountType:Ref<AmountType> = ref(constants.AMOUNT_TYPES.GROSS)

  watch(amountType, () => {
    if (amountType.value === constants.AMOUNT_TYPES.NET) {
      $q.notify({
        message: 'Przy wynagrodzeniu netto obliczenia są szacunkowe. Zalecane jest korzystanie z wynagroodzenia brutto, by poznać dokładne obliczenia.',
      })
    }
  })

  return amountType
}
