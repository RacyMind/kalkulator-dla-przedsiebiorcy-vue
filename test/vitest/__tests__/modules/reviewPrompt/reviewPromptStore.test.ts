import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import {
  useReviewPromptStore,
  MIN_CALCULATIONS_FOR_PROMPT,
  COOLDOWN_DAYS,
  MAX_PROMPT_COUNT,
} from 'stores/reviewPromptStore'

describe('reviewPromptStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('constants', () => {
    it('MIN_CALCULATIONS_FOR_PROMPT should be 5', () => {
      expect(MIN_CALCULATIONS_FOR_PROMPT).toBe(5)
    })

    it('COOLDOWN_DAYS should be 90', () => {
      expect(COOLDOWN_DAYS).toBe(90)
    })

    it('MAX_PROMPT_COUNT should be 3', () => {
      expect(MAX_PROMPT_COUNT).toBe(3)
    })
  })

  describe('incrementCalculationCount', () => {
    it('increments counter from 0 to 1', () => {
      const store = useReviewPromptStore()
      expect(store.calculationCount).toBe(0)
      store.incrementCalculationCount()
      expect(store.calculationCount).toBe(1)
    })

    it('increments counter from 4 to 5', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 4
      store.incrementCalculationCount()
      expect(store.calculationCount).toBe(5)
    })
  })

  describe('shouldShowPrompt', () => {
    it('returns false when calculationCount < 5', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 3
      expect(store.shouldShowPrompt()).toBe(false)
    })

    it('returns true when calculationCount >= 5, promptCount < 3, and no lastPromptDate', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 5
      store.promptCount = 0
      store.lastPromptDate = null
      expect(store.shouldShowPrompt()).toBe(true)
    })

    it('returns true when calculationCount is 10, promptCount is 1, and no lastPromptDate', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 10
      store.promptCount = 1
      store.lastPromptDate = null
      expect(store.shouldShowPrompt()).toBe(true)
    })

    it('returns false when promptCount >= 3', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 20
      store.promptCount = 3
      store.lastPromptDate = null
      expect(store.shouldShowPrompt()).toBe(false)
    })

    it('returns false when lastPromptDate is less than 90 days ago', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 10
      store.promptCount = 1

      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-01'))
      store.lastPromptDate = '2025-11-01'
      expect(store.shouldShowPrompt()).toBe(false)
      vi.useRealTimers()
    })

    it('returns true when lastPromptDate is 90+ days ago', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 10
      store.promptCount = 1

      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-01'))
      store.lastPromptDate = '2025-10-01'
      expect(store.shouldShowPrompt()).toBe(true)
      vi.useRealTimers()
    })

    it('returns false when calculationCount is exactly 4', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 4
      store.promptCount = 0
      store.lastPromptDate = null
      expect(store.shouldShowPrompt()).toBe(false)
    })

    it('returns true when calculationCount is exactly 5', () => {
      const store = useReviewPromptStore()
      store.calculationCount = 5
      store.promptCount = 0
      store.lastPromptDate = null
      expect(store.shouldShowPrompt()).toBe(true)
    })
  })

  describe('recordPromptShown', () => {
    it('sets lastPromptDate to current date and increments promptCount', () => {
      const store = useReviewPromptStore()
      store.promptCount = 0
      store.lastPromptDate = null

      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-03-15'))
      store.recordPromptShown()

      expect(store.lastPromptDate).toBe('2026-03-15')
      expect(store.promptCount).toBe(1)
      vi.useRealTimers()
    })

    it('increments promptCount from 1 to 2', () => {
      const store = useReviewPromptStore()
      store.promptCount = 1

      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-06-01'))
      store.recordPromptShown()

      expect(store.lastPromptDate).toBe('2026-06-01')
      expect(store.promptCount).toBe(2)
      vi.useRealTimers()
    })
  })
})
