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
  it('waits for premium initialization before resolving boot', async () => {
    let resolveInitialization: (() => void) | undefined
    initializePremium.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveInitialization = resolve
        }),
    )

    const bootPromise = premiumBoot()

    const result = await Promise.race([
      bootPromise.then(() => 'resolved'),
      new Promise<'timeout'>((resolve) => {
        setTimeout(() => resolve('timeout'), 30)
      }),
    ])

    expect(result).toBe('timeout')
    expect(initializePremium).toHaveBeenCalledTimes(1)

    resolveInitialization?.()
    await expect(bootPromise).resolves.toBeUndefined()
  })

  it('logs error when initialization rejects', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    initializePremium.mockRejectedValueOnce(new Error('boot_failed'))

    await premiumBoot()

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[PremiumBilling] premium boot initializePremium failed:',
      expect.any(Error),
    )

    consoleErrorSpy.mockRestore()
  })
})
