/**
 * Contract: Constants Store Public API
 * 
 * This file defines the public interface of the new Pinia constants store
 * that replaces both src/logic/constants.ts and src/composables/constants.ts.
 */

import type { ComputedRef } from 'vue'

// --- Enums (moved from composables/constants.ts) ---

export enum AmountTypes {
  Gross = 1,
  Net = 2,
}

export enum EntrepreneurTaxSystem {
  TaxScale = 1,
  FlatTax = 2,
  LumpSumTax = 3,
}

// --- Year System ---

export type AvailableYear = 2021 | 2022 | 2023 | 2024 | 2025 | 2026

// --- ZUS Interfaces ---

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

// --- Income Tax ---

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

// --- Wage Stats ---

export interface WageStats {
  averageWageInLastQuarter: (year?: number) => number
  minimumWage: (year?: number, monthIndex?: number) => number
  minimumHourlyWage: (year?: number, monthIndex?: number) => number
  projectedAverageWage: () => number
}

// --- App Config ---

export interface AppConfig {
  name: string
  version: string
}

// --- Store Public API ---

export interface ConstantsStoreState {
  app: AppConfig
  availableYears: AvailableYear[]
  monthNames: string[]
  fullYear: string
}

export interface ConstantsStoreGetters {
  zusConstants: ComputedRef<ZusConstants>
  incomeTaxConstants: ComputedRef<IncomeTaxConstants>
  wageStats: ComputedRef<WageStats>
}
