import {Ref, watch} from 'vue'
import {useLocalStorage} from '@vueuse/core'

export const useMonthlyPercentages = (value:Ref<number|null>, storagePrefix = '') => {
  const hasPercentageForEachMonth = useLocalStorage(`${storagePrefix}/hasPercentageForEachMonth`, false, { mergeDefaults: true })
  const monthlyValues: Ref<number[]> = useLocalStorage(`${storagePrefix}/monthlyValues`, [], { mergeDefaults: true })

  watch(hasPercentageForEachMonth, () => {
    if (!hasPercentageForEachMonth.value) {
      monthlyValues.value = []
      return
    }
    if(monthlyValues.value.length) {
      return
    }

    for(let i = 0; i < 12; i++) {
      monthlyValues.value[i] = value.value ?? 0
    }
  })

  return {
    hasPercentageForEachMonth,
    monthlyValues,
  }
}
