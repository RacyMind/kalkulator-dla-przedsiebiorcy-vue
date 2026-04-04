import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import Form from 'components/leasing/components/Form.vue'
import Tooltip from 'components/partials/Tooltip.vue'

installQuasarPlugin()

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()
const extractText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => extractText(item)).join(' ')
  }

  if (value && typeof value === 'object' && 'children' in value) {
    return extractText(value.children)
  }

  return ''
}

const createWrapper = () => {
  return mount(Form, {
    global: {
      stubs: {
        RouterLink: true,
      },
    },
  })
}

describe('Leasing form', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('uses shared Tooltip component for leasing field hints', () => {
    const wrapper = createWrapper()
    const tooltips = wrapper.findAllComponents(Tooltip)
    const tooltipTexts = tooltips.map((tooltip) =>
      normalizeText(extractText(tooltip.vm.$slots.default?.() ?? [])),
    )

    expect(tooltips).toHaveLength(7)
    expect(tooltipTexts).toContain(
      'Cena netto przedmiotu leasingu (bez VAT). Jeśli znasz cenę brutto, podziel ją przez 1,23.',
    )
    expect(tooltipTexts).toContain(
      'Kategoria wpływa na limit kosztów podatkowych: spalinowe 100 tys., hybrydy plug-in 150 tys., elektryczne 225 tys. zł.',
    )
    expect(tooltipTexts).toContain(
      'Procent wartości przedmiotu płatny na początku umowy. Im wyższa, tym niższa rata.',
    )
    expect(tooltipTexts).toContain(
      'Minimalny okres leasingu operacyjnego to 24 miesiące (wymóg ustawowy).',
    )
    expect(tooltipTexts).toContain(
      'Procent wartości przedmiotu do zapłaty po zakończeniu umowy. Typowo 1–20%.',
    )
    expect(tooltipTexts).toContain(
      'Nominalna roczna stopa procentowa. W praktyce to WIBOR + marża leasingodawcy.',
    )
    expect(tooltipTexts).toContain(
      '100% — auto wyłącznie firmowe (wymaga VAT-26 i kilometrówki). 50% — użytkowanie mieszane.',
    )
  })
})
