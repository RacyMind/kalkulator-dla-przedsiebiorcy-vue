import {ref} from 'vue'

export const useTaxFreeAmount = () => {
  const hasTaxFreeAmount = ref(true)
  const employerCount = ref(1)

  return {
    employerCount,
    hasTaxFreeAmount,
  }
}
