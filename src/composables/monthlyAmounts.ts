import {Ref, ref, watch} from 'vue'

export const useMonthlyAmounts = (amount:Ref<number|null>) => {
  const hasAmountForEachMonth = ref(false)
  const monthlyAmounts: Ref<number[]> = ref([])

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
