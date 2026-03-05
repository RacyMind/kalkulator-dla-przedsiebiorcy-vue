import { describe, expect, it } from 'vitest'
import menuItems from 'components/partials/menu/menuItems'

describe('menuItems app section', () => {
  it('does not include Google Play download entry in app section', () => {
    const hasGooglePlayEntry = menuItems.app.some(
      (item) => item.title === 'Pobierz w Google Play',
    )

    expect(hasGooglePlayEntry).toBe(false)
  })

  it('uses Polish description without DCA for savings plan menu item', () => {
    const savingsPlanItem = menuItems.savings.find(
      (item) => item.link === '/plan-oszczedzania',
    )

    expect(savingsPlanItem?.caption).toBe(
      'Ustal cel oszczędzania, symuluj regularne wpłaty i porównaj IKE, IKZE oraz inne formy oszczędzania.',
    )
    expect(savingsPlanItem?.caption).not.toContain('DCA')
  })
})
