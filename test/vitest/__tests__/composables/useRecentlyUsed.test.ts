import { describe, it, expect, beforeEach } from 'vitest'
import { useRecentlyUsed } from 'src/composables/useRecentlyUsed'

describe('useRecentlyUsed', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty list when no history', () => {
    const { recentModules } = useRecentlyUsed()
    expect(recentModules.value).toEqual([])
  })

  it('adds a module to recent list', () => {
    const { recentModules, addRecent } = useRecentlyUsed()
    addRecent('/umowa-o-dzielo', 'Umowa o dzieło')
    expect(recentModules.value).toHaveLength(1)
    expect(recentModules.value[0].path).toBe('/umowa-o-dzielo')
    expect(recentModules.value[0].name).toBe('Umowa o dzieło')
    expect(recentModules.value[0].timestamp).toBeGreaterThan(0)
  })

  it('deduplicates by path and moves to top', () => {
    const { recentModules, addRecent } = useRecentlyUsed()
    addRecent('/umowa-o-dzielo', 'Umowa o dzieło')
    addRecent('/faktura-vat', 'Faktura VAT')
    addRecent('/umowa-o-dzielo', 'Umowa o dzieło')
    expect(recentModules.value).toHaveLength(2)
    expect(recentModules.value[0].path).toBe('/umowa-o-dzielo')
    expect(recentModules.value[1].path).toBe('/faktura-vat')
  })

  it('limits to max 5 entries', () => {
    const { recentModules, addRecent } = useRecentlyUsed()
    addRecent('/a', 'A')
    addRecent('/b', 'B')
    addRecent('/c', 'C')
    addRecent('/d', 'D')
    addRecent('/e', 'E')
    addRecent('/f', 'F')
    expect(recentModules.value).toHaveLength(5)
    expect(recentModules.value[0].path).toBe('/f')
    expect(recentModules.value[4].path).toBe('/b')
  })

  it('deduplicates by name even with different path', () => {
    const { recentModules, addRecent } = useRecentlyUsed()
    addRecent('/limit-ewidencjonowania', 'Limit obrotu dla kasy fiskalnej')
    addRecent('/faktura-vat', 'Faktura VAT')
    addRecent('/limit-kasa-fiskalna', 'Limit obrotu dla kasy fiskalnej')
    expect(recentModules.value).toHaveLength(2)
    expect(recentModules.value[0].name).toBe('Limit obrotu dla kasy fiskalnej')
    expect(recentModules.value[0].path).toBe('/limit-kasa-fiskalna')
    expect(recentModules.value[1].name).toBe('Faktura VAT')
  })

  it('orders by most recently added first', () => {
    const { recentModules, addRecent } = useRecentlyUsed()
    addRecent('/a', 'A')
    addRecent('/b', 'B')
    addRecent('/c', 'C')
    expect(recentModules.value[0].path).toBe('/c')
    expect(recentModules.value[1].path).toBe('/b')
    expect(recentModules.value[2].path).toBe('/a')
  })
})
