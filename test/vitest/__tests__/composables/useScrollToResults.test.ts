import { beforeEach, describe, expect, it, vi } from 'vitest'
import helpers from 'src/logic/helpers'
import { useScrollToResults } from 'src/composables/useScrollToResults'

describe('useScrollToResults', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls to component root element when target is a Vue ref object', async () => {
    const scrollSpy = vi
      .spyOn(helpers, 'scrollToElement')
      .mockImplementation(() => {})

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })

    const { scrollTarget, scrollToResults } = useScrollToResults()
    const element = document.createElement('div')
    scrollTarget.value = { $el: element }

    await scrollToResults()

    expect(scrollSpy).toHaveBeenCalledWith(element)
  })

  it('scrolls to plain DOM element when target is direct element ref', async () => {
    const scrollSpy = vi
      .spyOn(helpers, 'scrollToElement')
      .mockImplementation(() => {})

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })

    const { scrollTarget, scrollToResults } = useScrollToResults()
    const element = document.createElement('section')
    scrollTarget.value = element

    await scrollToResults()

    expect(scrollSpy).toHaveBeenCalledWith(element)
  })
})
