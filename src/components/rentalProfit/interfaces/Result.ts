export interface YearResult {
  year: number
  monthlyRent: number
  grossRevenue: number
  taxableRevenue: number
  tax: number
  annualExpenses: number
  netProfit: number
  effectiveTaxRate: number
  cumulativeProfit: number
}

export interface Summary {
  totalGrossRevenue: number
  totalTaxableRevenue: number
  totalTax: number
  totalExpenses: number
  totalNetProfit: number
  averageMonthlyProfit: number
  effectiveTaxRate: number
}

export interface Result {
  yearResults: YearResult[]
  summary: Summary
}
