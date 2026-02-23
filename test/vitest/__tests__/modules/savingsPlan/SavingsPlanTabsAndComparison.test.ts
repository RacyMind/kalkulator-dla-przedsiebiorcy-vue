import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { InputFields } from 'components/savingsPlan/interfaces/InputFields'
import { SavingsPlanCalculator } from 'components/savingsPlan/logic/SavingsPlanCalculator'
import ScenarioComparison from 'components/savingsPlan/components/ScenarioComparison.vue'
import {
  getSavingsPlanToolLabel,
  SavingsPlanEmploymentForm,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'

installQuasarPlugin()

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

const getInput = (activeTool: SavingsPlanTool): InputFields => ({
  goalAmount: 100000,
  horizonYears: 15,
  monthlyContribution: 1500,
  initialCapital: 10000,
  conservativeReturnRate: 3,
  baseReturnRate: 6,
  optimisticReturnRate: 9,
  employmentForm: SavingsPlanEmploymentForm.EmploymentContract,
  taxationForm: SavingsPlanTaxationForm.TaxScale,
  annualTaxBase: 90000,
  annualLimitGrowthRate: 2,
  activeTool,
})

const getResult = (activeTool: SavingsPlanTool) =>
  new SavingsPlanCalculator()
    .setInputData(getInput(activeTool))
    .calculate()
    .getResult()

describe('SavingsPlan tabs and comparison', () => {
  it('uses tabs wired to savingsPlanToolOrder and keeps comparison section outside tab panels', () => {
    const pageSource = readTextFile(
      'src/components/savingsPlan/pages/Index.vue',
    )

    expect(pageSource).toContain('<QTabs')
    expect(pageSource).toContain('ref="scrollTarget"')
    expect(pageSource).toContain('v-for="tool in toolTabs"')
    expect(pageSource).toContain('savingsPlanToolOrder')
    expect(pageSource).toContain('store.setActiveTool(nextTool)')
    expect(pageSource).toContain(':swipeable="isMobileTabMode"')
    expect(pageSource).toContain(':key="tabPanelsKey"')
    expect(pageSource).toContain('class="bg-primary text-white shadow-2"')
    expect(pageSource).not.toContain('Podsumowanie')

    const scenarioComparisonMatches = pageSource.match(
      /<ScenarioComparison :result="store\.result" \/>/g,
    )

    expect(scenarioComparisonMatches?.length ?? 0).toBe(1)

    const tabPanelsEndIndex = pageSource.indexOf('</q-tab-panels>')
    const scenarioComparisonIndex = pageSource.indexOf(
      '<ScenarioComparison :result="store.result" />',
    )

    expect(tabPanelsEndIndex).toBeGreaterThan(-1)
    expect(scenarioComparisonIndex).toBeGreaterThan(tabPanelsEndIndex)
  })

  it('exposes no-relief tool label and keeps comparison in card form', () => {
    expect(getSavingsPlanToolLabel(SavingsPlanTool.NoRelief)).toBe('Bez ulg')

    const wrapper = mount(ScenarioComparison, {
      props: {
        result: getResult(SavingsPlanTool.NoRelief),
      },
    })

    expect(wrapper.text()).toContain('Ranking narzędzi')
    expect(wrapper.text()).toContain('Szczegóły scenariuszy')
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.findAll('.comparisonCard').length).toBe(6)
  })
})
