import { useStore } from 'vuex'
import { computed } from 'vue'
import invoice from 'src/logic/invoice'

export function inputData () {
  const store = useStore()
  const amount = computed(() => store.getters['invoice/amount'])
  const amountType = computed(() => store.getters['invoice/amountType'])
  const taxRate = computed(() => store.getters['invoice/taxRate'])

  return {
    amount,
    amountType,
    taxRate,
  }
}

export function useInvoice () {
  const {
    amount,
    amountType,
    taxRate,
  } = inputData()

  const result = computed(fu => {
    return invoice.getResult(
      amount.value,
      amountType.value,
      taxRate.value,
    )
  })

  return {
    result,
  }
}
