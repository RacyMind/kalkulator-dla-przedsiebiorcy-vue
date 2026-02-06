import {EcbSdmxResponse} from 'components/inflation/interfaces/InflationApiResponse'
import {InflationEntry} from 'components/inflation/interfaces/InflationEntry'
import axios from 'axios'

const ECB_API_URL = 'https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR'
const CACHE_TTL = 604800000
const CACHE_PREFIX = 'inflation-cache-'

interface CacheEntry {
  data: InflationEntry[]
  timestamp: number
}

function getCache(key: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    return JSON.parse(raw) as CacheEntry
  } catch {
    return null
  }
}

function setCache(key: string, entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch { /* quota exceeded — ignore */ }
}

function parseEcbResponse(response: EcbSdmxResponse): InflationEntry[] {
  try {
    const series = response.dataSets?.[0]?.series
    if (!series) return []

    const seriesKey = Object.keys(series)[0]
    if (!seriesKey) return []

    const observations = series[seriesKey].observations
    const timePeriods = response.structure?.dimensions?.observation
      ?.find(d => d.id === 'TIME_PERIOD')?.values

    if (!observations || !timePeriods) return []

    return timePeriods.map((period, index) => {
      const parts = period.id.split('-')
      const value = observations[String(index)]?.[0]
      return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        value: value ?? 0,
      }
    })
  } catch {
    return []
  }
}

function filterLastMonth(entries: InflationEntry[]): InflationEntry[] {
  const lastByYear = new Map<number, InflationEntry>()
  for (const entry of entries) {
    const existing = lastByYear.get(entry.year)
    if (!existing || entry.month > existing.month) {
      lastByYear.set(entry.year, entry)
    }
  }
  return Array.from(lastByYear.values()).sort((a, b) => a.year - b.year || a.month - b.month)
}

export default {
  fetchInflationRates(fromYear: number, mode = ''): Promise<InflationEntry[]> {
    const cacheKey = `${fromYear}-${mode}`
    const cached = getCache(cacheKey)

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return Promise.resolve(cached.data)
    }

    return axios.get(`${ECB_API_URL}?format=jsondata&startPeriod=${fromYear}-01`)
      .then(response => {
        let entries = parseEcbResponse(response.data)

        if (mode === 'lastMonth') {
          entries = filterLastMonth(entries)
        }

        setCache(cacheKey, { data: entries, timestamp: Date.now() })
        return entries
      })
      .catch(() => {
        if (cached) return cached.data
        return []
      })
  },

  clearCache() {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(CACHE_PREFIX)) keysToRemove.push(key)
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  },

  expireCache() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(CACHE_PREFIX)) {
        const entry = getCache(key.replace(CACHE_PREFIX, ''))
        if (entry) setCache(key.replace(CACHE_PREFIX, ''), { ...entry, timestamp: 0 })
      }
    }
  },
}
