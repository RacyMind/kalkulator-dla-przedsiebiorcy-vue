import {ZusContribution} from 'src/logic/zus/ZusContribution'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useConstants} from 'src/composables/constants'
import {useSettingStore} from 'stores/settingStore'


describe('ZUS contributions in 2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)

  })
  it('the basis for contibutions', () => {
    const zusContribution = new ZusContribution()
    const { zusConstants} = useConstants()

    expect(zusContribution.getContributionBasisWithinLimit(100)).toBe(100)
    expect(zusContribution.getContributionBasisWithinLimit(0)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(-1)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(zusConstants.contributionBasisLimit + 1)).toBe(zusConstants.contributionBasisLimit)
    expect(zusContribution.getContributionBasisWithinLimit(1000, zusConstants.contributionBasisLimit)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(1000, zusConstants.contributionBasisLimit + 1)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(1000, zusConstants.contributionBasisLimit - 500)).toBe(500)
    expect(zusContribution.getContributionBasisWithinLimit(400, zusConstants.contributionBasisLimit - 500)).toBe(400)
  })
})
