import {Ref, watch} from 'vue'
import {useLocalStorage} from '@vueuse/core'
import helpers from 'src/logic/helpers'

export const useHourlyAmount = (amount: Ref<number|null>, storagePrefix = '') => {
  const isHourlyAmount = useLocalStorage(`${storagePrefix}/isHourlyAmount`, false, { mergeDefaults: true })
  const hourlyAmount:Ref<number|null> = useLocalStorage(`${storagePrefix}/hourlyAmount`, null, { mergeDefaults: true })
  const hourCount:Ref<number|null> = useLocalStorage(`${storagePrefix}/hourCount`, null, { mergeDefaults: true })

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
