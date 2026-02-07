import {ZusContribution} from 'src/logic/zus/ZusContribution'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia, storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import {useSettingStore} from 'stores/settingStore'


describe('ZUS contributions in 2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)

  })
  it('the basis for contributions', () => {
    const zusContribution = new ZusContribution()
    const { zusConstants} = storeToRefs(useConstantsStore())

    expect(zusContribution.getContributionBasisWithinLimit(100)).toBe(100)
    expect(zusContribution.getContributionBasisWithinLimit(0)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(-1)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(zusConstants.value.contributionBasisLimit + 1)).toBe(zusConstants.value.contributionBasisLimit)
    expect(zusContribution.getContributionBasisWithinLimit(1000, zusConstants.value.contributionBasisLimit)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(1000, zusConstants.value.contributionBasisLimit + 1)).toBe(0)
    expect(zusContribution.getContributionBasisWithinLimit(1000, zusConstants.value.contributionBasisLimit - 500)).toBe(500)
    expect(zusContribution.getContributionBasisWithinLimit(400, zusConstants.value.contributionBasisLimit - 500)).toBe(400)
  })
})
