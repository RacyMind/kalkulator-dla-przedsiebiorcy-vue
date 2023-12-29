import {useLocalStorage} from '@vueuse/core'

export enum ContributionBasises {
  Big = 1,
  Small = 2,
  Custom = 3,
}

export const useContributionBasis = (storagePrefix = '') => {
  const contributionBasisOptions = [
    {
      label: 'Duży ZUS',
      value: ContributionBasises.Big,
    },
    {
      label: 'Mały ZUS',
      value: ContributionBasises.Small,
    },
    {
      label: 'Własna podstawa',
      value: ContributionBasises.Custom,
    },
  ]

  const chosenContributionBasis = useLocalStorage<ContributionBasises>(`${storagePrefix}/chosenContributionBasis`, ContributionBasises.Big, { mergeDefaults: true })

  return {
    contributionBasisOptions,
    chosenContributionBasis,
  }
}
