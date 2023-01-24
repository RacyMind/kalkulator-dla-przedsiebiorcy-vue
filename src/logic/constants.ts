import {AmountType} from 'src/types/AmountType'
import {IncomeTaxType} from 'src/types/IncomeTaxType'

const defaultParams = {
  ACCIDENT_RATE: 1.67,
  AMOUNT_OF_TAX_THRESHOLD: 85528,
  AVERAGE_SALARY: 5504.52,
  EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE: 300,
  EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE: 250,
  FREE_AMOUNT_OF_TAX: 8000,
  GROSS_AMOUNT_LIMIT_FOR_AID: 85528,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 157770,
  LUMP_SUM_UP_TO_AMOUNT: 200,
  MINIMUM_SALARY: 2800,
  PPK: {
    EMPLOYEE: {
      DEFAULT_RATE: 2,
      MAXIMUM_RATE: 4,
      MINIMUM_RATE: 0.5,
    },
    EMPLOYER: {
      DEFAULT_RATE: 1.5,
      MAXIMUM_RATE: 4,
      MINIMUM_RATE: 1.5,
    },
  },
  TAX_RATES: {
    BELKA_RATE: 19,
    FIRST_RATE: 17,
    LINEAR_RATE: 19,
    SECOND_RATE: 32,
  },
  TAX_RATES_FOR_LAMP_SUM: [
    {
      label: '2%',
      value: 2,
    },
    {
      label: '3%',
      value: 3,
    },
    {
      label: '5,5%',
      value: 5.5,
    },
    {
      label: '8,5%',
      value: 8.5,
    },
    {
      label: '10%',
      value: 10,
    },
    {
      label: '12.5%',
      value: 12.5,
    },
    {
      label: '15%',
      value: 15,
    },
    {
      label: '17%',
      value: 17,
    },
    {
      label: '20%',
      value: 20,
    },
  ],
  TAX_REDUCING_AMOUNT: 525.12 / 12,
  US: {
    EMPLOYEE: {
      HEALTH_RATE: 7.75,
    },
    OWNER: {
      HEALTH_RATE: 7.75,
      LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: 8700,
    },
  },
  ZUS: {
    EMPLOYEE: {
      HEALTH_RATE: 9,
      PENSION_RATE: 9.76,
      RENT_RATE: 1.5,
      SICK_RATE: 2.45,
    },
    EMPLOYER: {
      FGSP_RATE: 0.1,
      FP_RATE: 2.45,
      PENSION_RATE: 9.76,
      RENT_RATE: 6.5,
    },
    OWNER: {
      BASIS_AMOUNT_FOR_HEALTH: 4242.38,
      BIG_AMOUNT: 3155.40,
      FP_RATE: 2.45,
      HEALTH_RATE: 9,
      HEALTH_RATE_FOR_LINEAR_TAX: 0,
      PENSION_RATE: 19.52,
      RENT_RATE: 8,
      SICK_RATE: 2.45,
      SMALL_AMOUNT: 840,
    },
  },
  HOLIDAY_RATE: 21,
}
const from2021 = {
  ...defaultParams,
}
const from2022 = {
  ...from2021,
  AMOUNT_OF_TAX_THRESHOLD: 120000,
  AVERAGE_SALARY: 6221.04,
  FREE_AMOUNT_OF_TAX: 30000,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 177660,
  MINIMUM_SALARY: 3010,
  TAX_RATES: {
    BELKA_RATE: 19,
    FIRST_RATE: 12,
    LINEAR_RATE: 19,
    SECOND_RATE: 32,
  },
  TAX_RATES_FOR_LAMP_SUM: [
    {
      label: '2%',
      value: 2,
    },
    {
      label: '3%',
      value: 3,
    },
    {
      label: '5,5%',
      value: 5.5,
    },
    {
      label: '8,5%',
      value: 8.5,
    },
    {
      label: '10%',
      value: 10,
    },
    {
      label: '12%',
      value: 12,
    },
    {
      label: '12.5%',
      value: 12.5,
    },
    {
      label: '14%',
      value: 14,
    },
    {
      label: '15%',
      value: 15,
    },
    {
      label: '17%',
      value: 17,
    },
  ],
  TAX_REDUCING_AMOUNT: 3600 / 12,
  US: {
    ...from2021.US,
    EMPLOYEE: {
      ...from2021.US.EMPLOYEE,
      HEALTH_RATE: 0,
    },
    OWNER: {
      ...from2021.US.OWNER,
      HEALTH_RATE: 0,
    },
  },
  ZUS: {
    ...from2021.ZUS,
    OWNER: {
      ...from2021.ZUS.OWNER,
      BIG_AMOUNT: 3553.2,
      HEALTH_RATE_FOR_LINEAR_TAX: 4.9,
      SMALL_AMOUNT: 903,
    },
  },
  HOLIDAY_RATE: 20.92,
}
const from2023 = {
  ...from2022,
  AVERAGE_SALARY: 6965.94,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 208050,
  MINIMUM_SALARY: {
    FISRT_HALF_OF_YEAR: 3490,
    SECOND_HALF_OF_YEAR: 3600,
  },
  ZUS: {
    ...from2021.ZUS,
    OWNER: {
      ...from2021.ZUS.OWNER,
      BIG_AMOUNT: 4161,
      SMALL_AMOUNT: {
        FISRT_HALF_OF_YEAR: 1047,
        SECOND_HALF_OF_YEAR: 1080,
      },
      LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: 10200,
    },
  },
  HOLIDAY_RATE: 20.83,
}
export default {
  ACCIDENT_RATE: 1.67,
  AMOUNT_OF_POLSKI_LAD_TAX_THRESHOLD: 120000,
  AMOUNT_OF_TAX_THRESHOLD: 85528,
  AMOUNT_TYPES: {
    GROSS: 'gross' as AmountType,
    NET: 'net' as AmountType,
  },
  APP: {
    NAME: 'Kalkulator finansowy',
    VERSION: '4.10.0',
  },
  AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE: {
    CONTRACT_OF_EMPLOYMENT: 'contactOfEmployment',
    SELF_EMPLOYMENT: 'selfEmployment',
  },
  AVAILABLE_YEARS: [2021, 2022, 2023],
  BASIC_CAPITAL_INTEREST_RATE: 10.25,
  BASIC_LATE_INTEREST_RATE: 12.25,
  CASH_REGISTER_LIMIT: 20000,
  COLORS: {
    CASH_REGISTER_LIMIT: '#a31718',
    CHANGES_LOGS: '#00A7D9',
    CHART1: '#e32514',
    CHART2: '#edb113',
    CHART3: '#ed6d13',
    CHART4: '#360d13',
    CHART5: '#BB4985',
    CHART6: '#a31718',
    CHART7: '#00A7D9',
    CHART8: '#70B749',
    CONTACT: '#00A7D9',
    CONTRACT_OF_EMPLOYMENT: '#ed6d13',
    CONTRACT_OF_MANDATE: '#ed6d13',
    CONTRACT_WORK: '#ed6d13',
    CURRENCY_CONVERTER: '#BB4985',
    EXCHANGE_RATES: '#BB4985',
    INFORMATOR: '#FF8356',
    INTEREST: '#edb113',
    INVESTMENT: '#edb113',
    INVOICE: '#a31718',
    SELF_EMPLOYMENT: '#a31718',
    SICK_PAY: '#ed6d13',
    UNREGISTERED_COMPANY: '#a31718',
    VAT_LIMIT: '#a31718',
  },
  CONTRACT_OF_EMPLOYMENT: {
    AUTHOR_EXPENSES_RATE: 0.5,
    EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE: 300,
    EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE: 250,
  },
  CONTRACT_OF_MANDATE: {
    AUTHOR_EXPENSES_RATE: 0.5,
    EXPENSES_RATE: 0.2,
  },
  CONTRACT_WORK: {
    EXPENSES_20: 0.2,
    EXPENSES_50: 0.5,
  },
  FREE_AMOUNT_FOR_TAX: 525.12 / 12,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 157770,
  LOCALE_DATE: {
    /* starting with Sunday */
    days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
    daysShort: 'niedz._pon._wt._śr._czw._pt._sob.'.split('_'),
    firstDayOfWeek: 1,
    months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień_Cały rok'.split('_'),
    monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    wholeYearIndex: 12,
  },
  LUMP_SUM_UP_TO_AMOUNT: 200,
  MINIMUM_SALARY: 2800,
  PARAMS: {
    2021: from2021,
    2022: from2022,
    2023: from2023,
  },
  POLSKI_LAD_FREE_AMOUNT_FOR_TAX: 5100 / 12,
  PPK: {
    EMPLOYEE: {
      DEFAULT_RATE: 2,
      MAXIMUM_RATE: 4,
      MINIMUM_RATE: 0.5,
    },
    EMPLOYER: {
      DEFAULT_RATE: 1.5,
      MAXIMUM_RATE: 4,
      MINIMUM_RATE: 1.5,
    },
  },
  TAX_RATES: {
    BELKA_RATE: 19,
    FIRST_RATE: 17,
    LINEAR_RATE: 19,
    SECOND_RATE: 32,
  },
  TAX_RATES_FOR_LAMP_SUM: [
    {
      label: '2%',
      value: 2,
    },
    {
      label: '3%',
      value: 3,
    },
    {
      label: '5,5%',
      value: 5.5,
    },
    {
      label: '8,5%',
      value: 8.5,
    },
    {
      label: '10%',
      value: 10,
    },
    {
      label: '12.5%',
      value: 12.5,
    },
    {
      label: '15%',
      value: 15,
    },
    {
      label: '17%',
      value: 17,
    },
  ],
  TAX_TYPES: {
    GENERAL: 'general' as IncomeTaxType,
    LINEAR: 'linear' as IncomeTaxType,
    LUMP_SUM: 'lumpSum' as IncomeTaxType,
  },
  US: {
    EMPLOYEE: {
      HEALTH_RATE: 7.75,
      POLSKI_LAD_HEALTH_RATE: 0,
    },
    OWNER: {
      HEALTH_RATE: 7.75,
      POLSKI_LAD_HEALTH_RATE: 0,
    },
  },
  VAT_LIMIT: 200000,
  ZUS: {
    EMPLOYEE: {
      HEALTH_RATE: 9,
      PENSION_RATE: 9.76,
      RENT_RATE: 1.5,
      SICK_RATE: 2.45,
    },
    EMPLOYER: {
      FGSP_RATE: 0.1,
      FP_RATE: 2.45,
      PENSION_RATE: 9.76,
      RENT_RATE: 6.5,
    },
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
  },
}


