import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface RecentModule {
  path: string
  name: string
  timestamp: number
}

const MAX_RECENT = 5
const STORAGE_KEY = 'recently-used-modules'

export function useRecentlyUsed() {
  const recent = useLocalStorage<RecentModule[]>(STORAGE_KEY, [])

  const addRecent = (path: string, name: string) => {
    const filtered = recent.value.filter(m => m.path !== path)
    filtered.unshift({ path, name, timestamp: Date.now() })
    recent.value = filtered.slice(0, MAX_RECENT)
  }

  const recentModules = computed(() => recent.value)

  return { recentModules, addRecent }
}
