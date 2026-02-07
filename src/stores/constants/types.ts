export type AvailableYear = 2021 | 2022 | 2023 | 2024 | 2025 | 2026

export enum AmountTypes {
  Gross = 1,
  Net = 2,
}

export enum EntrepreneurTaxSystem {
  TaxScale = 1,
  FlatTax = 2,
  LumpSumTax = 3,
}

export interface EmployeeZusConstants {
  rates: {
    disabilityContribution: number
    healthContribution: number
    pensionContribution: number
    ppkContribution: { default: number; min: number; max: number }
    sickContribution: number
  }
}

export interface EmployerZusConstants {
  rates: {
    accidentCContribution: { default: number; min: number; max: number }
    disabilityContribution: number
    fgspContribution: number
    fpContribution: number
    fsContribution: number
    pensionContribution: number
    ppkContribution: { default: number; min: number; max: number }
  }
}

export interface EntrepreneurZusConstants {
  basises: {
    big: number
    small: (monthIndex?: number) => number
    startRelief: number
  }
  rates: {
    accidentCContribution: { default: number; min: number; max: number }
    disabilityContribution: number
    fgspContribution: number
    fpContribution: number
    fsContribution: number
    healthContribution: { taxScales: number; flatTax: number }
    pensionContribution: number
    sickContribution: number
  }
}

export interface ZusConstants {
  contributionBasisLimit: number
  employee: EmployeeZusConstants
  employer: EmployerZusConstants
  entrepreneur: EntrepreneurZusConstants
}

export interface IncomeTaxConstants {
  taxReliefLimit: number
  taxScale: {
    expenses: {
      amounts: { workInLivingPlace: number; workOutsideLivingPlace: number }
      rates: { default: number; author: number }
      withoutExpensesUpTo: number
    }
    taxFreeAmount: number
    taxThreshold: number
    taxRates: { first: number; second: number }
  }
  flatTax: {
    deductibleHealthContributionLimit: number
    taxRate: number
  }
  belkaTaxRate: number
}

export interface WageStats {
  averageWageInLastQuarter: (year?: number) => number
  minimumWage: (year?: number, monthIndex?: number) => number
  minimumHourlyWage: (year?: number, monthIndex?: number) => number
  projectedAverageWage: () => number
}

export interface AppConfig {
  name: string
  version: string
}
