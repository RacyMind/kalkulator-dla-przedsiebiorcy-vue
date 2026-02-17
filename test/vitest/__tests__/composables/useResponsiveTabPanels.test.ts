import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'

let mockQuasar: {
  platform: {
    is: {
      mobile: boolean
    }
  }
  screen: {
    lt: {
      md: boolean
    }
  }
}

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()

  return {
    ...actual,
    useQuasar: () => mockQuasar,
  }
})

import { useResponsiveTabPanels } from 'src/composables/useResponsiveTabPanels'

describe('useResponsiveTabPanels', () => {
  beforeEach(() => {
    mockQuasar = reactive({
      platform: {
        is: {
          mobile: false,
        },
      },
      screen: {
        lt: {
          md: false,
        },
      },
    })
  })

  it('uses desktop mode when viewport is not mobile', () => {
    const { isMobileTabMode, tabPanelsKey } = useResponsiveTabPanels()

    expect(isMobileTabMode.value).toBe(false)
    expect(tabPanelsKey.value).toBe('desktop')
  })

  it('uses mobile mode when platform is mobile', () => {
    mockQuasar.platform.is.mobile = true
    const { isMobileTabMode, tabPanelsKey } = useResponsiveTabPanels()

    expect(isMobileTabMode.value).toBe(true)
    expect(tabPanelsKey.value).toBe('mobile')
  })

  it('uses mobile mode when screen is below md', () => {
    mockQuasar.screen.lt.md = true
    const { isMobileTabMode, tabPanelsKey } = useResponsiveTabPanels()

    expect(isMobileTabMode.value).toBe(true)
    expect(tabPanelsKey.value).toBe('mobile')
  })

  it('updates key when breakpoint changes from desktop to mobile', async () => {
    const { isMobileTabMode, tabPanelsKey } = useResponsiveTabPanels()

    expect(isMobileTabMode.value).toBe(false)
    expect(tabPanelsKey.value).toBe('desktop')

    mockQuasar.screen.lt.md = true
    await nextTick()

    expect(isMobileTabMode.value).toBe(true)
    expect(tabPanelsKey.value).toBe('mobile')
  })
})
