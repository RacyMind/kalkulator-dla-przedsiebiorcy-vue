import { describe, expect, it, vi } from 'vitest'

const { initializePremium } = vi.hoisted(() => ({
  initializePremium: vi.fn(),
}))

vi.mock('stores/premiumStore', () => ({
  usePremiumStore: () => ({
    initializePremium,
  }),
}))

import premiumBoot from 'boot/premium'

describe('premium boot', () => {
  it('does not block app startup while initialization is pending', async () => {
    initializePremium.mockImplementation(
      () =>
        new Promise<void>(() => {
          return
        }),
    )

    const result = await Promise.race([
      Promise.resolve(premiumBoot()).then(() => 'resolved'),
      new Promise<'timeout'>((resolve) => {
        setTimeout(() => resolve('timeout'), 30)
      }),
    ])

    expect(result).toBe('resolved')
    expect(initializePremium).toHaveBeenCalledTimes(1)
  })

  it('logs error when initialization rejects', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    initializePremium.mockRejectedValueOnce(new Error('boot_failed'))

    premiumBoot()
    await Promise.resolve()

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[PremiumBilling] premium boot initializePremium failed:',
      expect.any(Error),
    )

    consoleErrorSpy.mockRestore()
  })
})
