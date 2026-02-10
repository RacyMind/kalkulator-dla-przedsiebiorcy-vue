import { computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useSettingStore } from 'stores/settingStore'
import helpers from 'src/logic/helpers'
import { YEAR_PARAMS } from './constants/yearParams'
import type {
  AvailableYear,
  EmployeeZusConstants,
  EmployerZusConstants,
  EntrepreneurZusConstants,
  IncomeTaxConstants,
  WageStats,
  ZusConstants,
} from './constants/types'
import type { AmountType } from 'src/types/AmountType'
import type { IncomeTaxType } from 'src/types/IncomeTaxType'

export { AmountTypes, EntrepreneurTaxSystem } from './constants/types'
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

  const app = {
    name: 'Kalkulator finansowy',
    version: '6.0.0',
  }

  const amountTypes = {
    gross: 'gross' as AmountType,
    net: 'net' as AmountType,
  }

  const taxTypes = {
    general: 'general' as IncomeTaxType,
    linear: 'linear' as IncomeTaxType,
    lumpSum: 'lumpSum' as IncomeTaxType,
  }

  const availableYears: AvailableYear[] = [2021, 2022, 2023, 2024, 2025, 2026]

  const contractOfEmployment = {
    authorExpensesRate: 0.5,
    expensesIfYouWorkWhereYouDontLive: 300,
    expensesIfYouWorkWhereYouLive: 250,
  }

  const contractOfMandate = {
    authorExpensesRate: 0.5,
    expensesRate: 0.2,
  }

  const contractWork = {
    expenses20: 0.2,
    expenses50: 0.5,
  }

  const ppk = {
    employee: { defaultRate: 2, maximumRate: 4, minimumRate: 0.5 },
    employer: { defaultRate: 1.5, maximumRate: 4, minimumRate: 1.5 },
  }

  const vatLimit = 200000
  const cashRegisterLimit = 20000

  const rentalTax = {
    lumpSumRate: 0.085,
    lumpSumRateAboveThreshold: 0.125,
    threshold: 100000,
    spouseThreshold: 200000,
  }

  const localeDate = {
    days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split(
      '_',
    ),
    daysShort: 'niedz._pon._wt._śr._czw._pt._sob.'.split('_'),
    firstDayOfWeek: 1,
    months:
      'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień_Cały rok'.split(
        '_',
      ),
    monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    wholeYearIndex: 12,
  }

  const monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ]

  const fullYear = 'Cały rok'

  const basicCapitalInterestRate = 7.5
  const basicLateInterestRate = 9.5

  const taxRates = {
    belkaRate: 19,
    firstRate: 17,
    linearRate: 19,
    secondRate: 32,
  }

  const taxRatesForLumpSum = [
    { label: '2%', value: 2 },
    { label: '3%', value: 3 },
    { label: '5,5%', value: 5.5 },
    { label: '8,5%', value: 8.5 },
    { label: '10%', value: 10 },
    { label: '12.5%', value: 12.5 },
    { label: '15%', value: 15 },
    { label: '17%', value: 17 },
  ]

  const lumpSumUpToAmount = 200
  const minimumSalary = 2800
  const freeAmountForTax = 525.12 / 12
  const limitBasicAmountForZus = 157770
  const accidentRate = 1.67
  const amountOfTaxThreshold = 85528
  const amountOfPolskiLadTaxThreshold = 120000
  const polskiLadFreeAmountForTax = 5100 / 12

  const us = {
    employee: { healthRate: 7.75, polskiLadHealthRate: 0 },
    owner: { healthRate: 7.75, polskiLadHealthRate: 0 },
  }

  const zus = {
    employee: {
      healthRate: 9,
      pensionRate: 9.76,
      rentRate: 1.5,
      sickRate: 2.45,
    },
    employer: { fgspRate: 0.1, fpRate: 2.45, pensionRate: 9.76, rentRate: 6.5 },
    owner: {
      basisAmountForHealth: 4242.38,
      bigAmount: 3553.2,
      fpRate: 2.45,
      healthRate: 9,
      pensionRate: 19.52,
      rentRate: 8,
      sickRate: 2.45,
      smallAmount: 903,
    },
  }

  const availableFormsOfAccountingForMarriage = {
    contractOfEmployment: 'contactOfEmployment',
    selfEmployment: 'selfEmployment',
  }

  // --- Year-dependent computed getters ---

  const yearParams = computed(() => {
    const year = settingStore.dateOfLawRules.getFullYear() as AvailableYear
    return YEAR_PARAMS[year] ?? YEAR_PARAMS[2026]
  })

  const wageStats = computed<WageStats>(() => {
    return {
      averageWageInLastQuarter: (
        year = settingStore.dateOfLawRules.getFullYear() - 1,
      ) => {
        if (year <= 2022) return 6965.94
        if (year <= 2023) return 7767.85
        if (year <= 2024) return 8549.18
        return 9228.64
      },
      minimumWage: (
        year = settingStore.dateOfLawRules.getFullYear(),
        monthIndex = settingStore.dateOfLawRules.getMonth(),
      ) => {
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
      minimumHourlyWage: (
        year = settingStore.dateOfLawRules.getFullYear(),
        monthIndex = settingStore.dateOfLawRules.getMonth(),
      ) => {
        if (year <= 2023) {
          if (monthIndex <= 5) return 22.8
          return 23.5
        }
        if (year <= 2024) {
          if (monthIndex <= 5) return 27.7
          return 28.1
        }
        if (year <= 2025) return 30.5
        return 31.4
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
        deductibleHealthContributionLimit:
          settingStore.dateOfLawRules.getFullYear() <= 2023 ? 10200 : 11600,
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
        small: (monthIndex = settingStore.dateOfLawRules.getMonth()) =>
          helpers.round(
            0.3 *
              wageStats.value.minimumWage(
                settingStore.dateOfLawRules.getFullYear(),
                monthIndex,
              ),
            2,
          ),
        startRelief: 0,
      },
      rates: {
        accidentCContribution: employerZusConstants.rates.accidentCContribution,
        disabilityContribution:
          employeeZusConstants.rates.disabilityContribution +
          employerZusConstants.rates.disabilityContribution,
        fgspContribution: employerZusConstants.rates.fgspContribution,
        fpContribution: employerZusConstants.rates.fpContribution,
        fsContribution: employerZusConstants.rates.fsContribution,
        healthContribution: {
          taxScales: employeeZusConstants.rates.healthContribution,
          flatTax: 0.049,
        },
        pensionContribution:
          employeeZusConstants.rates.pensionContribution +
          employerZusConstants.rates.pensionContribution,
        sickContribution: employeeZusConstants.rates.sickContribution,
      },
    }

    return {
      contributionBasisLimit: helpers.round(
        30 * wageStats.value.projectedAverageWage(),
        2,
      ),
      employee: employeeZusConstants,
      employer: employerZusConstants,
      entrepreneur: entrepreneurZusConstants,
    }
  })

  const params = YEAR_PARAMS

  return {
    app,
    amountTypes,
    availableFormsOfAccountingForMarriage,
    availableYears,
    basicCapitalInterestRate,
    basicLateInterestRate,
    accidentRate,
    amountOfPolskiLadTaxThreshold,
    amountOfTaxThreshold,
    cashRegisterLimit,
    contractOfEmployment,
    contractOfMandate,
    contractWork,
    freeAmountForTax,
    fullYear,
    limitBasicAmountForZus,
    localeDate,
    lumpSumUpToAmount,
    minimumSalary,
    monthNames,
    params,
    polskiLadFreeAmountForTax,
    ppk,
    rentalTax,
    taxRates,
    taxRatesForLumpSum,
    taxTypes,
    us,
    vatLimit,
    zus,
    incomeTaxConstants,
    wageStats,
    yearParams,
    zusConstants,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConstantsStore, import.meta.hot))
}
