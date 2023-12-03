import {ZusContribution} from 'src/logic/zus/ZusContribution'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'


describe('ZUS contributions in 2023', () => {
  let zusContribution:ZusContribution

  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)

    zusContribution = new ZusContribution()
  })
  it('the basis for contibutions', () => {
    expect(zusContribution.getContributionBasis(100)).toBe(100)
    expect(zusContribution.getContributionBasis(0)).toBe(0)
    expect(zusContribution.getContributionBasis(-1)).toBe(0)
    expect(zusContribution.getContributionBasis(ZusContribution.contributionBasisLimit + 1)).toBe(ZusContribution.contributionBasisLimit)
    expect(zusContribution.getContributionBasis(1000, ZusContribution.contributionBasisLimit)).toBe(0)
    expect(zusContribution.getContributionBasis(1000, ZusContribution.contributionBasisLimit + 1)).toBe(0)
    expect(zusContribution.getContributionBasis(1000, ZusContribution.contributionBasisLimit - 500)).toBe(500)
    expect(zusContribution.getContributionBasis(400, ZusContribution.contributionBasisLimit - 500)).toBe(400)
  })
})
