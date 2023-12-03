import {Ref, ref, watch} from 'vue'
import helpers from 'src/logic/helpers'

export const useHourlyAmount = (amount: Ref<number|null>) => {
  const isHourlyAmount = ref(false)
  const hourlyAmount:Ref<number|null> = ref(null)
  const hourCount:Ref<number|null> = ref(null)

  watch(hourlyAmount, () => {
    if (!isHourlyAmount.value) {
      return
    }
    if(!hourlyAmount.value || !hourCount.value) {
      return
    }
    amount.value = helpers.round(hourlyAmount.value * hourCount.value, 2)
  })
  watch(hourCount, () => {
    if (!isHourlyAmount.value) {
      return
    }
    if(!hourlyAmount.value || !hourCount.value) {
      return
    }
    amount.value = helpers.round(hourlyAmount.value * hourCount.value, 2)
  })

  return {
    hourCount,
    hourlyAmount,
    isHourlyAmount,
  }
}
