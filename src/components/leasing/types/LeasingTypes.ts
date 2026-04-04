export enum AssetType {
  Car = 'car',
  Other = 'other',
}

export enum EmissionCategory {
  Combustion = 'combustion',
  PluginHybrid = 'pluginHybrid',
  Electric = 'electric',
}

export enum VatDeductionRate {
  Full = 1,
  Half = 0.5,
  None = 0,
}

export interface ScheduleRow {
  month: number
  installmentNet: number
  capitalPart: number
  interestPart: number
  remainingBalance: number
}

export const emissionCategoryLimits: Record<EmissionCategory, number> = {
  [EmissionCategory.Combustion]: 100000,
  [EmissionCategory.PluginHybrid]: 150000,
  [EmissionCategory.Electric]: 225000,
}
