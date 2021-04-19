export default {
  VAT_VALUES: [
    {
      label: '0%',
      value: 0,
    },
    {
      label: '5%',
      value: 5,
    },
    {
      label: '8%',
      value: 8,
    },
    {
      label: '23%',
      value: 23,
    },
  ],
  DEFAULT_VAT_VALUE: {
    label: '23%',
    value: 23,
  },
  AMOUNT_TYPES: {
    NET: 'net',
    GROSS: 'gross',
  },
  TAX_RATES: {
    FIRST_RATE: 17,
    SECOND_RATE: 32,
    LINEAR_RATE: 19,
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
    GENERAL: 'general',
    LINEAR: 'linear',
    LUMP_SUM: 'lumpSum',
  },
  FREE_AMOUNT_FOR_TAX: 525.12 / 12,
  BASIC_INTEREST_RATE: 13,
  AMOUNT_OF_TAX_THRESHOLD: 85528,
  LUMP_SUM_UP_TO_AMOUNT: 200,
  CONTRACT_WORK: {
    EXPENSES_20: 0.2,
    EXPENSES_50: 0.5,
  },
  CONTRACT_OF_MANDATE: {
    EXPENSES_RATE: 0.2,
  },
  CONTRACT_OF_EMPLOYMENT: {
    EXPENSES_IF_YOU_WORK_WHERE_YOU_LIVE: 250,
    EXPENSES_IF_YOU_WORK_WHERE_YOU_DONT_LIVE: 300,
  },
  ACCIDENT_RATE: 1.67,
  US: {
    EMPLOYEE: {
      HEALTH_RATE: 7.75,
    },
    OWNER: {
      HEALTH_RATE: 7.75,
    },
  },
  LIMIT_BASIC_AMOUNT_FOR_ZUS: 157770,
  ZUS: {
    EMPLOYEE: {
      PENSION_RATE: 9.76,
      RENT_RATE: 1.5,
      SICK_RATE: 2.45,
      HEALTH_RATE: 9,
    },
    EMPLOYER: {
      PENSION_RATE: 9.76,
      RENT_RATE: 6.5,
      FP_RATE: 1,
      FGSP_RATE: 1.45,
    },
    OWNER: {
      PENSION_RATE: 19.52,
      RENT_RATE: 8,
      SICK_RATE: 2.45,
      HEALTH_RATE: 9,
      FP_RATE: 2.45,
      BASIS_AMOUNT_FOR_HEALTH: 4242.38,
      BIG_AMOUNT: 3155.40,
      SMALL_AMOUNT: 840,
    },
  },

  LOCALE_DATE: {
    /* starting with Sunday */
    days: 'Niedziela_Poniedziałek_Wtorek_Środa_Czwartek_Piątek_Sobota'.split('_'),
    daysShort: 'niedz._pon._wt._śr._czw._pt._sob.'.split('_'),
    months: 'Styczeń_Luty_Marzec_Kwiecień_Maj_Czerwiec_Lipiec_Sierpień_Wrzesień_Październik_Listopad_Grudzień'.split('_'),
    monthsShort: 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
    firstDayOfWeek: 1,
  },
  COLORS: {
    INVOICE: '#ed6d13',
    INTEREST: '#ed9113',
    CONTRACT_WORK: '#ed4913',
    CONTRACT_OF_MANDATE: '#e84034',
    CONTRACT_OF_EMPLOYMENT: '#b82324',
    SELF_EMPLOYMENT: '#a31718',
  },
}
