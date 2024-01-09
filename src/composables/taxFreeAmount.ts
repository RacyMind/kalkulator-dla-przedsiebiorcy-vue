import {useLocalStorage} from '@vueuse/core'

export const useTaxFreeAmount = (storagePrefix = '') => {
  const hasTaxFreeAmount = useLocalStorage(`${storagePrefix}/hasTaxFreeAmount`, true, { mergeDefaults: true })
  const employerCount = useLocalStorage(`${storagePrefix}/employerCount`, 1, { mergeDefaults: true })

  return {
    employerCount,
    hasTaxFreeAmount,
  }
}
