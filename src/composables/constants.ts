import {useSettingStore} from 'stores/settingStore'
import helpers from 'src/logic/helpers'

type numericFunction = (num?: number) => number

enum AmountTypes {
  Gross = 1,
  Net = 2,
}

export enum EntrepreneurTaxSystem {
  TaxScale = 1,
  FlatTax = 2,
  LumpSumTax = 3,
}

interface EmployeeZusConstants {
  rates: {
    disabilityContribution: number,
    healthContribution: number,
    pensionContribution: number,
    ppkContribution: {
      default: number,
      min: number,
      max: number,
    },
    sickContribution: number,
  }
}

interface EmployerZusConstants {
  rates: {
    accidentCContribution: {
      default: number,
      min: number,
      max: number,
    },
    disabilityContribution: number,
    fgspContribution: number,
    fpContribution: number,
    fsContribution: number,
    pensionContribution: number,
    ppkContribution: {
      default: number,
      min: number,
      max: number,
    }
  }
}

interface EntrepreneurZusConstants {
  basises: {
    big: number,
    small: numericFunction,
    startRelief: number,
  }
  rates: {
    accidentCContribution: {
      default: number,
      min: number,
      max: number,
    },
    disabilityContribution: number,
    fgspContribution: number,
    fpContribution: number,
    fsContribution: number,
    healthContribution: {
      taxScales: number,
      flatTax: number,
    },
    pensionContribution: number,
    sickContribution: number,
  }
}

interface zusConstants {
  // the limit of basis for sick, pension and disability contributions
  contributionBasisLimit: number,
  employee: EmployeeZusConstants,
  employer: EmployerZusConstants,
  entrepreneur: EntrepreneurZusConstants
}

interface IncomeTaxConstants{
  // Over the amount, the tax relief is end
  taxReliefLimit: number,
  taxScale: {
    expenses: {
      amounts: {
        workInLivingPlace: number,
        workOutsideLivingPlace: number,
      },
      rates: {
        default: number,
        author: number
      },
      // It uses by civil agrreements - contract of mandate and work contract
      withoutExpensesUpTo: number,
    },
    taxFreeAmount: number,
    // Over the amount, the tax percentage is increased
    taxThreshold: number,
    taxRates: {
      first: number,
      second: number,
    },
  },
  flatTax: {
    deductibleHealthContributionLimit: number
    taxRate: number
  }
}

interface WageStats {
  averageWageInLastQuarter: number,
  minimumWage: (year: number, monthIndex:number) => number,
  projectedAverageWage: number,
}

export const useConstants = () => {
  const settingStore = useSettingStore()

  const wageStats:WageStats = {
    // Q4 2022
    averageWageInLastQuarter: 6965.94,
    minimumWage: (year = settingStore.dateOfLawRules.getFullYear(), monthIndex = settingStore.dateOfLawRules.getMonth()) => {
      if(year <= 2022) {
        return 3010
      }
      if(year <= 2023) {
        if(monthIndex <= 5) {
          return 3490
        }
        return 3600
      }
      if(monthIndex <= 5) {
        return 4242
      }
      return 4300
    },
    projectedAverageWage: settingStore.dateOfLawRules.getFullYear() <= 2023 ? 6935 : 7824,
  }

  const incomeTaxConstnts: IncomeTaxConstants = {
    taxReliefLimit: 85528,
    taxScale: {
      expenses: {
        amounts: {
          workInLivingPlace: 250,
          workOutsideLivingPlace: 300,
        },
        rates: {
          default: 0.2,
          author: 0.5,
        },
        withoutExpensesUpTo: 200,
      },
      taxFreeAmount: 30000,
      taxThreshold: 120000,
      taxRates: {
        first: 0.12,
        second: 0.32,
      },
    },
    flatTax: {
      deductibleHealthContributionLimit: 10200,
      taxRate: 0.19,
    },
  }

  const employeeZusConstants:EmployeeZusConstants = {
    rates: {
      disabilityContribution: 0.015,
      healthContribution: 0.09,
      pensionContribution: 0.0976,
      ppkContribution: {
        default: 0.02,
        min: 0.005,
        max: 0.04,
      },
      sickContribution: 0.0245,
    },
  }

  const employerZusConstants:EmployerZusConstants = {
    rates: {
      accidentCContribution: {
        default: 0.0167,
        min: 0,
        max: 0.0333,
      },
      disabilityContribution: 0.065,
      fgspContribution: 0.001,
      fpContribution: 0.01,
      fsContribution: 0.0145,
      pensionContribution: 0.0976,
      ppkContribution: {
        default: 0.015,
        min: 0.015,
        max: 0.04,
      },
    },
  }

  const entrepreneurZusConstants:EntrepreneurZusConstants = {
    basises: {
      big: helpers.round(0.6 * wageStats.projectedAverageWage, 2),
      small: (monthIndex = settingStore.dateOfLawRules.getMonth()) => helpers.round(0.3 * wageStats.minimumWage(settingStore.dateOfLawRules.getFullYear(), monthIndex), 2),
      startRelief: 0,
    },
    rates: {
      accidentCContribution: employerZusConstants.rates.accidentCContribution,
      disabilityContribution: employeeZusConstants.rates.disabilityContribution + employerZusConstants.rates.disabilityContribution,
      fgspContribution: employerZusConstants.rates.fgspContribution,
      fpContribution: employerZusConstants.rates.fpContribution,
      fsContribution: employerZusConstants.rates.fsContribution,
      healthContribution: {
        taxScales: employeeZusConstants.rates.healthContribution,
        flatTax: 0.049,
      },
      pensionContribution: employeeZusConstants.rates.pensionContribution + employerZusConstants.rates.pensionContribution,
      sickContribution: employeeZusConstants.rates.sickContribution,
    },
  }

  const zusConstants: zusConstants = {
    contributionBasisLimit: helpers.round(30 * wageStats.projectedAverageWage, 2),
    employee: employeeZusConstants,
    employer: employerZusConstants,
    entrepreneur: entrepreneurZusConstants,
  }

  return {
    AmountTypes,
    EntrepreneurTaxSystem,
    incomeTaxConstnts,
    wageStats,
    zusConstants,
  }
}
