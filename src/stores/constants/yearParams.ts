import type {AvailableYear} from './types'

interface YearParamData {
  ACCIDENT_RATE: number
  AMOUNT_OF_TAX_THRESHOLD: number
  AVERAGE_SALARY: number
  EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE: number
  EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE: number
  FREE_AMOUNT_OF_TAX: number
  GROSS_AMOUNT_LIMIT_FOR_AID: number
  LIMIT_BASIC_AMOUNT_FOR_ZUS: number
  LUMP_SUM_UP_TO_AMOUNT: number
  MINIMUM_SALARY: number | { FISRT_HALF_OF_YEAR: number; SECOND_HALF_OF_YEAR: number }
  PPK: {
    EMPLOYEE: { DEFAULT_RATE: number; MAXIMUM_RATE: number; MINIMUM_RATE: number }
    EMPLOYER: { DEFAULT_RATE: number; MAXIMUM_RATE: number; MINIMUM_RATE: number }
  }
  TAX_RATES: {
    BELKA_RATE: number
    FIRST_RATE: number
    LINEAR_RATE: number
    SECOND_RATE: number
  }
  TAX_RATES_FOR_LAMP_SUM: Array<{ label: string; value: number }>
  TAX_REDUCING_AMOUNT: number
  US: {
    EMPLOYEE: { HEALTH_RATE: number }
    OWNER: { HEALTH_RATE: number; LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: number }
  }
  ZUS: {
    EMPLOYEE: { HEALTH_RATE: number; PENSION_RATE: number; RENT_RATE: number; SICK_RATE: number }
    EMPLOYER: { FGSP_RATE: number; FP_RATE: number; PENSION_RATE: number; RENT_RATE: number }
    OWNER: {
      BASIS_AMOUNT_FOR_HEALTH: number
      BIG_AMOUNT: number
      FP_RATE: number
      HEALTH_RATE: number
      HEALTH_RATE_FOR_LINEAR_TAX: number
      PENSION_RATE: number
      RENT_RATE: number
      SICK_RATE: number
      SMALL_AMOUNT: number | { FISRT_HALF_OF_YEAR: number; SECOND_HALF_OF_YEAR: number }
      LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION?: number
    }
  }
  HOLIDAY_RATE: number
}

const defaultParams: YearParamData = {
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
    EMPLOYEE: { DEFAULT_RATE: 2, MAXIMUM_RATE: 4, MINIMUM_RATE: 0.5 },
    EMPLOYER: { DEFAULT_RATE: 1.5, MAXIMUM_RATE: 4, MINIMUM_RATE: 1.5 },
  },
  TAX_RATES: { BELKA_RATE: 19, FIRST_RATE: 17, LINEAR_RATE: 19, SECOND_RATE: 32 },
  TAX_RATES_FOR_LAMP_SUM: [
    { label: '2%', value: 2 },
    { label: '3%', value: 3 },
    { label: '5,5%', value: 5.5 },
    { label: '8,5%', value: 8.5 },
    { label: '10%', value: 10 },
    { label: '12.5%', value: 12.5 },
    { label: '15%', value: 15 },
    { label: '17%', value: 17 },
    { label: '20%', value: 20 },
  ],
  TAX_REDUCING_AMOUNT: 525.12 / 12,
  US: {
    EMPLOYEE: { HEALTH_RATE: 7.75 },
    OWNER: { HEALTH_RATE: 7.75, LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: 8700 },
  },
  ZUS: {
    EMPLOYEE: { HEALTH_RATE: 9, PENSION_RATE: 9.76, RENT_RATE: 1.5, SICK_RATE: 2.45 },
    EMPLOYER: { FGSP_RATE: 0.1, FP_RATE: 2.45, PENSION_RATE: 9.76, RENT_RATE: 6.5 },
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

const from2021: YearParamData = { ...defaultParams }

const from2022: YearParamData = {
  ...from2021,
  AMOUNT_OF_TAX_THRESHOLD: 120000,
  AVERAGE_SALARY: 6221.04,
  FREE_AMOUNT_OF_TAX: 30000,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 177660,
  MINIMUM_SALARY: 3010,
  TAX_RATES: { BELKA_RATE: 19, FIRST_RATE: 12, LINEAR_RATE: 19, SECOND_RATE: 32 },
  TAX_RATES_FOR_LAMP_SUM: [
    { label: '2%', value: 2 },
    { label: '3%', value: 3 },
    { label: '5,5%', value: 5.5 },
    { label: '8,5%', value: 8.5 },
    { label: '10%', value: 10 },
    { label: '12%', value: 12 },
    { label: '12.5%', value: 12.5 },
    { label: '14%', value: 14 },
    { label: '15%', value: 15 },
    { label: '17%', value: 17 },
  ],
  TAX_REDUCING_AMOUNT: 3600 / 12,
  US: {
    ...from2021.US,
    EMPLOYEE: { ...from2021.US.EMPLOYEE, HEALTH_RATE: 0 },
    OWNER: { ...from2021.US.OWNER, HEALTH_RATE: 0 },
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

const from2023: YearParamData = {
  ...from2022,
  AVERAGE_SALARY: 6965.94,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 208050,
  MINIMUM_SALARY: { FISRT_HALF_OF_YEAR: 3490, SECOND_HALF_OF_YEAR: 3600 },
  US: {
    ...from2022.US,
    OWNER: { ...from2022.US.OWNER as { HEALTH_RATE: number; LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: number }, LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: 10200 },
  },
  ZUS: {
    ...from2022.ZUS,
    OWNER: {
      ...from2022.ZUS.OWNER as YearParamData['ZUS']['OWNER'],
      BIG_AMOUNT: 4161,
      SMALL_AMOUNT: { FISRT_HALF_OF_YEAR: 1047, SECOND_HALF_OF_YEAR: 1080 },
      LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION: 10200,
    },
  },
  HOLIDAY_RATE: 20.83,
}

const from2024: YearParamData = {
  ...from2023,
  AVERAGE_SALARY: 7824,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 234720,
  MINIMUM_SALARY: { FISRT_HALF_OF_YEAR: 4242, SECOND_HALF_OF_YEAR: 4300 },
  ZUS: {
    ...from2023.ZUS,
    OWNER: {
      ...from2023.ZUS.OWNER as YearParamData['ZUS']['OWNER'],
      BASIS_AMOUNT_FOR_HEALTH: 4242,
      BIG_AMOUNT: 4694.40,
      SMALL_AMOUNT: { FISRT_HALF_OF_YEAR: 1272.60, SECOND_HALF_OF_YEAR: 1290 },
    },
  },
}

const from2025: YearParamData = {
  ...from2024,
  AVERAGE_SALARY: 8673,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 260190,
  MINIMUM_SALARY: 4666,
  ZUS: {
    ...from2024.ZUS,
    OWNER: {
      ...from2024.ZUS.OWNER as YearParamData['ZUS']['OWNER'],
      BASIS_AMOUNT_FOR_HEALTH: 4666,
      BIG_AMOUNT: 5203.80,
      SMALL_AMOUNT: 1399.80,
    },
  },
}

const from2026: YearParamData = {
  ...from2025,
  AVERAGE_SALARY: 9420,
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 282600,
  MINIMUM_SALARY: 4806,
  ZUS: {
    ...from2025.ZUS,
    OWNER: {
      ...from2025.ZUS.OWNER as YearParamData['ZUS']['OWNER'],
      BASIS_AMOUNT_FOR_HEALTH: 4806,
      BIG_AMOUNT: 5652,
      SMALL_AMOUNT: 1441.80,
    },
  },
}

export const YEAR_PARAMS: Record<AvailableYear, YearParamData> = {
  2021: from2021,
  2022: from2022,
  2023: from2023,
  2024: from2024,
  2025: from2025,
  2026: from2026,
}

export type {YearParamData}
