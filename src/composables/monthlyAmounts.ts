import {Ref, watch} from 'vue'
import {useLocalStorage} from '@vueuse/core'

export const useMonthlyAmounts = (amount:Ref<number|null>, storagePrefix = '') => {
  const hasAmountForEachMonth = useLocalStorage(`${storagePrefix}/hasAmountForEachMonth`, false, { mergeDefaults: true })
  const monthlyAmounts: Ref<number[]> = useLocalStorage(`${storagePrefix}/monthlyAmounts`, [], { mergeDefaults: true })

  watch(hasAmountForEachMonth, () => {
    if (!hasAmountForEachMonth.value) {
      monthlyAmounts.value = []
      return
    }
    if(monthlyAmounts.value.length) {
      return
    }

    for(let i = 0; i < 12; i++) {
      monthlyAmounts.value[i] = amount.value ?? 0
    }
  })

  return {
    hasAmountForEachMonth,
    monthlyAmounts,
  }
}
