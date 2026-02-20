import { describe, expect, it } from 'vitest'
import menuItems from 'components/partials/menu/menuItems'

describe('menuItems app section', () => {
  it('does not include Google Play download entry in app section', () => {
    const hasGooglePlayEntry = menuItems.app.some(
      (item) => item.title === 'Pobierz w Google Play',
    )

    expect(hasGooglePlayEntry).toBe(false)
  })
})
