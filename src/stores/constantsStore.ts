import {computed} from 'vue'
import {acceptHMRUpdate, defineStore} from 'pinia'
import {useSettingStore} from 'stores/settingStore'
import helpers from 'src/logic/helpers'
import {YEAR_PARAMS} from './constants/yearParams'
import type {
  AvailableYear,
  EmployeeZusConstants,
  EmployerZusConstants,
  EntrepreneurZusConstants,
  IncomeTaxConstants,
  WageStats,
  ZusConstants,
} from './constants/types'
import type {AmountType} from 'src/types/AmountType'
import type {IncomeTaxType} from 'src/types/IncomeTaxType'

export {AmountTypes, EntrepreneurTaxSystem} from './constants/types'
export type {
  AvailableYear,
  EmployeeZusConstants,
  EmployerZusConstants,
  EntrepreneurZusConstants,
  IncomeTaxConstants,
  WageStats,
  ZusConstants,
} from './constants/types'

export const useConstantsStore = defineStore('constantsStore', () => {
  const settingStore = useSettingStore()

  // --- Static constants ---

  const APP = {
    NAME: 'Kalkulator finansowy',
    VERSION: '5.11.0',
  }

  const AMOUNT_TYPES = {
    GROSS: 'gross' as AmountType,
    NET: 'net' as AmountType,
  }

  const TAX_TYPES = {
    GENERAL: 'general' as IncomeTaxType,
    LINEAR: 'linear' as IncomeTaxType,
    LUMP_SUM: 'lumpSum' as IncomeTaxType,
  }

  const AVAILABLE_YEARS: AvailableYear[] = [2021, 2022, 2023, 2024, 2025, 2026]

  const CONTRACT_OF_EMPLOYMENT = {
    AUTHOR_EXPENSES_RATE: 0.5,
    EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE: 300,
    EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE: 250,
  }

  const CONTRACT_OF_MANDATE = {
    AUTHOR_EXPENSES_RATE: 0.5,
    EXPENSES_RATE: 0.2,
  }

  const CONTRACT_WORK = {
    EXPENSES_20: 0.2,
    EXPENSES_50: 0.5,
  }

  const PPK = {
    EMPLOYEE: { DEFAULT_RATE: 2, MAXIMUM_RATE: 4, MINIMUM_RATE: 0.5 },
    EMPLOYER: { DEFAULT_RATE: 1.5, MAXIMUM_RATE: 4, MINIMUM_RATE: 1.5 },
  }

  const VAT_LIMIT = 200000
  const CASH_REGISTER_LIMIT = 20000

  const RENTAL_TAX = {
    LUMP_SUM_RATE: 0.085,
    LUMP_SUM_RATE_ABOVE_THRESHOLD: 0.125,
    THRESHOLD: 100000,
    SPOUSE_THRESHOLD: 200000,
  }

  const LOCALE_DATE = {
    days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
    daysShort: 'niedz._pon._wt._śr._czw._pt._sob.'.split('_'),
    firstDayOfWeek: 1,
    months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień_Cały rok'.split('_'),
    monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    wholeYearIndex: 12,
  }

  const MONTH_NAMES = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
  ]

  const FULL_YEAR = 'Cały rok'

  const BASIC_CAPITAL_INTEREST_RATE = 7.5
  const BASIC_LATE_INTEREST_RATE = 9.5

  const TAX_RATES = {
    BELKA_RATE: 19,
    FIRST_RATE: 17,
    LINEAR_RATE: 19,
    SECOND_RATE: 32,
  }

  const TAX_RATES_FOR_LAMP_SUM = [
    { label: '2%', value: 2 },
    { label: '3%', value: 3 },
    { label: '5,5%', value: 5.5 },
    { label: '8,5%', value: 8.5 },
    { label: '10%', value: 10 },
    { label: '12.5%', value: 12.5 },
    { label: '15%', value: 15 },
    { label: '17%', value: 17 },
  ]

  const LUMP_SUM_UP_TO_AMOUNT = 200
  const MINIMUM_SALARY = 2800
  const FREE_AMOUNT_FOR_TAX = 525.12 / 12
  const LIMIT_BASIC_AMOUNT_FOR_ZUS = 157770
  const ACCIDENT_RATE = 1.67
  const AMOUNT_OF_TAX_THRESHOLD = 85528
  const AMOUNT_OF_POLSKI_LAD_TAX_THRESHOLD = 120000
  const POLSKI_LAD_FREE_AMOUNT_FOR_TAX = 5100 / 12

  const US = {
    EMPLOYEE: { HEALTH_RATE: 7.75, POLSKI_LAD_HEALTH_RATE: 0 },
    OWNER: { HEALTH_RATE: 7.75, POLSKI_LAD_HEALTH_RATE: 0 },
  }

  const ZUS = {
    EMPLOYEE: { HEALTH_RATE: 9, PENSION_RATE: 9.76, RENT_RATE: 1.5, SICK_RATE: 2.45 },
    EMPLOYER: { FGSP_RATE: 0.1, FP_RATE: 2.45, PENSION_RATE: 9.76, RENT_RATE: 6.5 },
    OWNER: {
      BASIS_AMOUNT_FOR_HEALTH: 4242.38,
      BIG_AMOUNT: 3553.2,
      FP_RATE: 2.45,
      HEALTH_RATE: 9,
      PENSION_RATE: 19.52,
      RENT_RATE: 8,
      SICK_RATE: 2.45,
      SMALL_AMOUNT: 903,
    },
  }


  const AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE = {
    CONTRACT_OF_EMPLOYMENT: 'contactOfEmployment',
    SELF_EMPLOYMENT: 'selfEmployment',
  }

  // --- Year-dependent computed getters ---

  const yearParams = computed(() => {
    const year = settingStore.dateOfLawRules.getFullYear() as AvailableYear
    return YEAR_PARAMS[year] ?? YEAR_PARAMS[2026]
  })

  const wageStats = computed<WageStats>(() => {
    return {
      averageWageInLastQuarter: (year = settingStore.dateOfLawRules.getFullYear() - 1) => {
        if (year <= 2022) return 6965.94
        if (year <= 2023) return 7767.85
        if (year <= 2024) return 8549.18
        return 9228.64
      },
      minimumWage: (year = settingStore.dateOfLawRules.getFullYear(), monthIndex = settingStore.dateOfLawRules.getMonth()) => {
        if (year <= 2022) return 3010
        if (year <= 2023) {
          if (monthIndex <= 5) return 3490
          return 3600
        }
        if (year <= 2024) {
          if (monthIndex <= 5) return 4242
          return 4300
        }
        if (year <= 2025) return 4666
        return 4806
      },
      minimumHourlyWage: (year = settingStore.dateOfLawRules.getFullYear(), monthIndex = settingStore.dateOfLawRules.getMonth()) => {
        if (year <= 2023) {
          if (monthIndex <= 5) return 22.8
          return 23.5
        }
        if (year <= 2024) {
          if (monthIndex <= 5) return 27.7
          return 28.1
        }
        if (year <= 2025) return 30.5
        return 31.40
      },
      projectedAverageWage: () => {
        if (settingStore.dateOfLawRules.getFullYear() <= 2023) return 6935
        if (settingStore.dateOfLawRules.getFullYear() <= 2024) return 7824
        if (settingStore.dateOfLawRules.getFullYear() <= 2025) return 8673
        return 9420
      },
    }
  })

  const incomeTaxConstants = computed<IncomeTaxConstants>(() => {
    return {
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
        deductibleHealthContributionLimit: settingStore.dateOfLawRules.getFullYear() <= 2023 ? 10200 : 11600,
        taxRate: 0.19,
      },
      belkaTaxRate: 0.19,
    }
  })

  const zusConstants = computed<ZusConstants>(() => {
    const employeeZusConstants: EmployeeZusConstants = {
      rates: {
        disabilityContribution: 0.015,
        healthContribution: 0.09,
        pensionContribution: 0.0976,
        ppkContribution: { default: 0.02, min: 0.005, max: 0.04 },
        sickContribution: 0.0245,
      },
    }

    const employerZusConstants: EmployerZusConstants = {
      rates: {
        accidentCContribution: { default: 0.0167, min: 0, max: 0.0333 },
        disabilityContribution: 0.065,
        fgspContribution: 0.001,
        fpContribution: 0.01,
        fsContribution: 0.0145,
        pensionContribution: 0.0976,
        ppkContribution: { default: 0.015, min: 0.015, max: 0.04 },
      },
    }

    const entrepreneurZusConstants: EntrepreneurZusConstants = {
      basises: {
        big: helpers.round(0.6 * wageStats.value.projectedAverageWage(), 2),
        small: (monthIndex = settingStore.dateOfLawRules.getMonth()) => helpers.round(0.3 * wageStats.value.minimumWage(settingStore.dateOfLawRules.getFullYear(), monthIndex), 2),
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

    return {
      contributionBasisLimit: helpers.round(30 * wageStats.value.projectedAverageWage(), 2),
      employee: employeeZusConstants,
      employer: employerZusConstants,
      entrepreneur: entrepreneurZusConstants,
    }
  })

  // Legacy compatibility: PARAMS map (used by old logic/constants consumers)
  const PARAMS = YEAR_PARAMS

  return {
    // Static constants
    APP,
    AMOUNT_TYPES,
    AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE,
    AVAILABLE_YEARS,
    BASIC_CAPITAL_INTEREST_RATE,
    BASIC_LATE_INTEREST_RATE,
    ACCIDENT_RATE,
    AMOUNT_OF_POLSKI_LAD_TAX_THRESHOLD,
    AMOUNT_OF_TAX_THRESHOLD,
    CASH_REGISTER_LIMIT,
    CONTRACT_OF_EMPLOYMENT,
    CONTRACT_OF_MANDATE,
    CONTRACT_WORK,
    FREE_AMOUNT_FOR_TAX,
    FULL_YEAR,
    LIMIT_BASIC_AMOUNT_FOR_ZUS,
    LOCALE_DATE,
    LUMP_SUM_UP_TO_AMOUNT,
    MINIMUM_SALARY,
    MONTH_NAMES,
    PARAMS,
    POLSKI_LAD_FREE_AMOUNT_FOR_TAX,
    PPK,
    RENTAL_TAX,
    TAX_RATES,
    TAX_RATES_FOR_LAMP_SUM,
    TAX_TYPES,
    US,
    VAT_LIMIT,
    ZUS,
    // Year-dependent computed
    incomeTaxConstants,
    wageStats,
    yearParams,
    zusConstants,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConstantsStore, import.meta.hot))
}
