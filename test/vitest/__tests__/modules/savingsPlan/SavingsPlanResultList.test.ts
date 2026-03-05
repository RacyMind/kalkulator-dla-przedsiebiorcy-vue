import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import ResultList from 'components/savingsPlan/components/ResultList.vue'
import { SavingsPlanCalculator } from 'components/savingsPlan/logic/SavingsPlanCalculator'
import {
  SavingsPlanEmploymentForm,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { useSettingStore } from 'stores/settingStore'

installQuasarPlugin()

const getInput = (activeTool: SavingsPlanTool): InputFields => ({
  goalAmount: 200000,
  horizonYears: 15,
  monthlyContribution: 1000,
  initialCapital: 0,
  conservativeReturnRate: 4,
  baseReturnRate: 6,
  optimisticReturnRate: 8,
  employmentForm: SavingsPlanEmploymentForm.EmploymentContract,
  taxationForm: SavingsPlanTaxationForm.TaxScale,
  annualTaxBase: 90000,
  annualLimitGrowthRate: 0,
  activeTool,
})

const getResult = (activeTool: SavingsPlanTool) =>
  new SavingsPlanCalculator()
    .setInputData(getInput(activeTool))
    .calculate()
    .getResult()

describe('SavingsPlan ResultList tax rows', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('renders IKZE relief and payout tax as separate rows in base variant', () => {
    const wrapper = mount(ResultList, {
      props: {
        result: getResult(SavingsPlanTool.Ikze),
      },
    })

    expect(wrapper.text()).toContain('Ulga podatkowa (wariant bazowy)')
    expect(wrapper.text()).toContain('Podatek przy wypłacie (wariant bazowy)')
    expect(wrapper.text()).not.toContain('Podatki i ulgi (wariant bazowy)')
  })

  it('renders belka tax as a separate row for no-relief tool', () => {
    const wrapper = mount(ResultList, {
      props: {
        result: getResult(SavingsPlanTool.NoRelief),
      },
    })

    expect(wrapper.text()).toContain('Podatek Belki (wariant bazowy)')
    expect(wrapper.text()).not.toContain('Podatki i ulgi (wariant bazowy)')
  })

  it('hides annual limit growth row for no-relief tool', () => {
    const wrapper = mount(ResultList, {
      props: {
        result: getResult(SavingsPlanTool.NoRelief),
      },
    })

    expect(wrapper.text()).not.toContain('Założony roczny wzrost limitów')
  })

  it('shows annual limit growth row for IKE and IKZE tools', () => {
    const ikeWrapper = mount(ResultList, {
      props: {
        result: getResult(SavingsPlanTool.Ike),
      },
    })
    const ikzeWrapper = mount(ResultList, {
      props: {
        result: getResult(SavingsPlanTool.Ikze),
      },
    })

    expect(ikeWrapper.text()).toContain('Założony roczny wzrost limitów')
    expect(ikzeWrapper.text()).toContain('Założony roczny wzrost limitów')
  })
})
