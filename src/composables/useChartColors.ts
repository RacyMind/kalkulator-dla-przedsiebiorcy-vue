import {computed, ref, watch} from 'vue'
import {Dark} from 'quasar'

export interface ChartColors {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  chart6: string
  chart7: string
  chart8: string
  chart9: string
  chart10: string
}

export interface ModuleColors {
  work: string
  business: string
  taxes: string
  currencies: string
  percentage: string
  informator: string
}

const FALLBACK_CHART: ChartColors = {
  chart1: '#1565C0',
  chart2: '#FF6F00',
  chart3: '#2E7D32',
  chart4: '#8E24AA',
  chart5: '#00897B',
  chart6: '#D32F2F',
  chart7: '#F9A825',
  chart8: '#5D4037',
  chart9: '#C2185B',
  chart10: '#546E7A',
}

const FALLBACK_MODULE: ModuleColors = {
  work: '#B45309',
  business: '#B91C1C',
  taxes: '#C2410C',
  currencies: '#0D9488',
  percentage: '#15803D',
  informator: '#0369A1',
}

function getCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

const version = ref(0)

function readChartColors(): ChartColors {
  return {
    chart1: getCssVar('--chart-1', FALLBACK_CHART.chart1),
    chart2: getCssVar('--chart-2', FALLBACK_CHART.chart2),
    chart3: getCssVar('--chart-3', FALLBACK_CHART.chart3),
    chart4: getCssVar('--chart-4', FALLBACK_CHART.chart4),
    chart5: getCssVar('--chart-5', FALLBACK_CHART.chart5),
    chart6: getCssVar('--chart-6', FALLBACK_CHART.chart6),
    chart7: getCssVar('--chart-7', FALLBACK_CHART.chart7),
    chart8: getCssVar('--chart-8', FALLBACK_CHART.chart8),
    chart9: getCssVar('--chart-9', FALLBACK_CHART.chart9),
    chart10: getCssVar('--chart-10', FALLBACK_CHART.chart10),
  }
}

function readModuleColors(): ModuleColors {
  return {
    work: getCssVar('--module-work', FALLBACK_MODULE.work),
    business: getCssVar('--module-business', FALLBACK_MODULE.business),
    taxes: getCssVar('--module-taxes', FALLBACK_MODULE.taxes),
    currencies: getCssVar('--module-currencies', FALLBACK_MODULE.currencies),
    percentage: getCssVar('--module-percentage', FALLBACK_MODULE.percentage),
    informator: getCssVar('--module-informator', FALLBACK_MODULE.informator),
  }
}

export function useChartColors() {
  const chartColors = computed(() => {
    void version.value
    return readChartColors()
  })

  const moduleColors = computed(() => {
    void version.value
    return readModuleColors()
  })

  const refresh = () => {
    version.value++
  }

  watch(() => Dark.isActive, () => {
    setTimeout(() => refresh(), 50)
  })

  return { chartColors, moduleColors, refresh }
}
