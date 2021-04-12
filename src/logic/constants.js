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
  TAX_RATES: {
    FIRST_RATE: 17,
  },
  BASIC_INTEREST_RATE: 13,
  AMOUNT_TYPES: {
    NET: 'net',
    GROSS: 'gross',
  },
  CONTRACT_WORK: {
    EXPENSES_20: 0.2,
    EXPENSES_50: 0.5,
    AMOUNT_TAX_THRESHOLD: 85528,
    LUMP_SUM_UP_TO_AMOUNT: 200,
  },
  CONTRACT_OF_MANDATE: {
    EXPENSES_RATE: 0.2,
    ACCIDENT_RATE: 1.67,
    LUMP_SUM_UP_TO_AMOUNT: 200,
  },
  US: {
    EMPLOYEE: {
      HEALTH_RATE: 7.75,
    },
  },
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
  },
}
