import {useLocalStorage} from '@vueuse/core'

export enum ContributionBasises {
  Big = 1,
  Small = 2,
  Custom = 3,
}

export const useContributionBasis = (storagePrefix = '') => {
  const chosenContributionBasis = useLocalStorage<ContributionBasises>(`${storagePrefix}/chosenContributionBasis`, ContributionBasises.Big, { mergeDefaults: true })

  return {
    chosenContributionBasis,
  }
}
