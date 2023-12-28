import {ref} from 'vue'

export enum ContributionBasises {
  Big = 1,
  Small = 2,
  Custom = 3,
}

export const useContributionBasis = () => {
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

  const chosenContributionBasis = ref(ContributionBasises.Big)

  return {
    contributionBasisOptions,
    chosenContributionBasis,
  }
}
