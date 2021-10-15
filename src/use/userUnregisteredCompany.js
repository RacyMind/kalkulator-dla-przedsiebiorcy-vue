import { useStore } from 'vuex'
import { computed } from 'vue'
import unregisteredCompany from 'src/logic/unregisteredCompany'

export function inputData () {
  const store = useStore()
  const amount = computed(() => store.getters['unregisteredCompany/amount'])
  const expenses = computed(() => store.getters['unregisteredCompany/expenses'])

  return {
    amount,
    expenses,
  }
}

export function userUnregisteredCompany () {
  const {
    amount,
    expenses,
  } = inputData()

  const result = computed(fu => {
    return unregisteredCompany.getResult(
      amount.value,
      expenses.value,
    )
  })

  return {
    result,
  }
}
