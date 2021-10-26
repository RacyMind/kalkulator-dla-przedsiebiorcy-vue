import { useStore } from 'vuex'
import { computed, watch, toRef } from 'vue'
import contractWork from 'src/logic/contractWork'

function setWatchers (props) {
  const year = toRef(props, 'year')
  watch(year, () => {
    contractWork.setYear(year.value)
  }, { immediate: true })
}

export function inputData () {
  const store = useStore()
  const amount = computed(() => store.getters['contractWork/amount'])
  const amountType = computed(() => store.getters['contractWork/amountType'])
  const expenseRate = computed(() => store.getters['contractWork/expenseRate'])

  return {
    amount,
    amountType,
    expenseRate,
  }
}

export function useResult (props) {
  setWatchers(props)

  const {
    amount,
    amountType,
    expenseRate,
  } = inputData()

  const result = computed(() => {
    return contractWork.getResult(
      amount.value,
      amountType.value,
      expenseRate.value,
    )
  })

  return {
    result,
  }
}
