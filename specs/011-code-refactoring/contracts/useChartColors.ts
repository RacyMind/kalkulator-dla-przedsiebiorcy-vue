/**
 * Contract: useChartColors Composable Public API
 * 
 * Replaces the COLORS object from constants.ts.
 * Reads CSS custom properties from _design-tokens.scss at runtime.
 */

import type { ComputedRef } from 'vue'

export interface ChartColors {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  chart6: string
  chart7: string
  chart8: string
}

export interface ModuleColors {
  work: string
  business: string
  taxes: string
  currencies: string
  percentage: string
  informator: string
}

export interface UseChartColorsReturn {
  chartColors: ComputedRef<ChartColors>
  moduleColors: ComputedRef<ModuleColors>
  refresh: () => void
}

export declare function useChartColors(): UseChartColorsReturn
