import {
  ChartSeries,
  SavingsPlanTool,
  ToolProjection,
} from 'components/savingsPlan/types/SavingsPlanTypes'

export interface Result {
  goalAmount: number
  horizonMonths: number
  monthlyContribution: number
  activeTool: SavingsPlanTool
  annualLimitGrowthRate: number
  chartLabels: string[]
  chartSeries: ChartSeries[]
  toolProjections: ToolProjection[]
}
