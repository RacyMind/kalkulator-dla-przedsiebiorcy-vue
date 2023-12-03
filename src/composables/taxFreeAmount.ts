import {ref} from 'vue'

export const useTaxFreeAmount = () => {
  const employerCountOptions = [
    {
      label: '1 pracodawcy',
      value: 1,
    },
    {
      label: '2 pracodawców',
      value: 2,
    },
    {
      label: '3 pracodawców',
      value: 3,
    },
  ]

  const hasTaxFreeAmount = ref(true)
  const employerCount = ref(1)

  return {
    employerCountOptions,
    employerCount,
    hasTaxFreeAmount,
  }
}
