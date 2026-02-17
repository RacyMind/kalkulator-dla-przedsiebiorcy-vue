import { beforeEach, describe, expect, it, vi } from 'vitest'
import helpers from 'src/logic/helpers'

const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
    writable: true,
  })
}

const createElement = (top: number) => ({
  getBoundingClientRect: () => ({ top }),
})

describe('helpers.scrollToElement', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls to target with header offset when result is below viewport', () => {
    setScrollY(0)
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    helpers.scrollToElement(createElement(1200))

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 1140,
      behavior: 'smooth',
    })
  })

  it('scrolls even when target is partially visible but not aligned', () => {
    setScrollY(500)
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    helpers.scrollToElement(createElement(200))

    expect(scrollSpy).toHaveBeenCalledWith({
      top: 640,
      behavior: 'smooth',
    })
  })

  it('does not scroll when viewport is already aligned with target', () => {
    setScrollY(640)
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    helpers.scrollToElement(createElement(60))

    expect(scrollSpy).not.toHaveBeenCalled()
  })

  it('does nothing when target element is missing', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    helpers.scrollToElement(undefined)

    expect(scrollSpy).not.toHaveBeenCalled()
  })
})
