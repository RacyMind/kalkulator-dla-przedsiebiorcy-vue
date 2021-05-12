export default {
  APP: {
    NAME: 'Kalkulator finansowy',
    VERSION: '3.5.0',
  },
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
    BELKA_RATE: 19,
  },
  SICK_PAY_RATES: [
    {
      label: '80%',
      value: 80,
    },
    {
      label: '100%',
      value: 100,
    },
  ],
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
  BASIC_CAPITAL_INTEREST_RATE: 3.6,
  BASIC_LATE_INTEREST_RATE: 5.6,
  AMOUNT_OF_TAX_THRESHOLD: 85528,
  LUMP_SUM_UP_TO_AMOUNT: 200,
  CONTRACT_WORK: {
    EXPENSES_20: 0.2,
    EXPENSES_50: 0.5,
  },
  CONTRACT_OF_MANDATE: {
    EXPENSES_RATE: 0.2,
    AUTHOR_EXPENSES_RATE: 0.5,
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
      FP_RATE: 2.45,
      FGSP_RATE: 0.1,
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
  PPK: {
    EMPLOYEE: {
      MINIMUM_RATE: 0.5,
      MAXIMUM_RATE: 2,
      DEFAULT_RATE: 2,
    },
    EMPLOYER: {
      MINIMUM_RATE: 1.5,
      MAXIMUM_RATE: 2.5,
      DEFAULT_RATE: 1.5,
    },
  },
  MENU: {
    BUSINESS: [
      {
        title: 'Samozatrudnienie',
        caption: 'Moduł oblicza składowe wynagrodzenia przy samozatrudnieniu',
        className: 'c-selfEmployment',
        link: '/samozatrudnienie',
      },
      {
        title: 'Faktura VAT',
        caption: 'Moduł przelicza kwoty z netto na brutto i z brutto na netto',
        className: 'c-invoice',
        link: '/faktura-vat',
      },

    ],
    WORK: [
      {
        title: 'Umowa o pracę',
        caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o pracę',
        className: 'c-contractOfEmployment',
        link: '/umowa-o-prace',
      },
      {
        title: 'Umowa zlecenie',
        caption: 'Moduł oblicza składowe wynagrodzenia przy umowie zlecenie',
        className: 'c-contractOfMandate',
        link: '/umowa-zlecenie',
      },
      {
        title: 'Umowa o dzieło',
        caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o dzieło',
        className: 'c-contractWork',
        link: '/umowa-o-dzielo',
      },
      {
        title: 'Zasiłek chorobowy',
        caption: 'Moduł oblicza wysokość zasiłku chorobowego',
        className: 'c-sickPay',
        link: '/zasilek-chorobowy',
      },
    ],
    PERCENTAGE: [
      {
        title: 'Lokata',
        caption: 'Moduł oblicza zysk z lokaty',
        className: 'c-investment',
        link: '/lokata',
      },
      {
        title: 'Odsetki',
        caption: 'Moduł oblicza odsetki za każdy dzień',
        className: 'c-interest',
        link: '/odsetki',
      },
    ],
    CURRENCIES: [
      {
        title: 'Kursy walut',
        caption: 'Moduł pokazuje kursy walut',
        className: 'c-exchangeRates',
        link: '/kursy-walut',
      },
      {
        title: 'Przelicznik walut',
        caption: 'Moduł służy do przeliczania jednej waluty na drugą',
        className: 'c-currencyConverter',
        link: '/przelicznik-walut',
      },
    ],
    APP: [
      {
        title: 'Historia zmian',
        caption: 'Pokazuje historię zmian w aplikacji',
        className: 'c-changeLogs',
        link: '/historia-zmian',
      },
      {
        title: 'Formularz kontaktowy',
        caption: 'Formularz do zgłaszania błędów lub pomysłów na nowe funkcje',
        className: 'c-contact',
        link: '/kontakt',
      },
      {
        title: 'O aplikacji',
        caption: '',
        className: 'c-aboutApp',
        link: 'https://kalkulatorfinansowy.app',
      },
    ],
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
    INVOICE: '#CB4135',
    INVESTMENT: '#BE8900',
    INTEREST: '#edb113',
    CONTRACT_WORK: '#FF9E8D',
    CONTRACT_OF_MANDATE: '#FF8356',
    CONTRACT_OF_EMPLOYMENT: '#ed6d13',
    SELF_EMPLOYMENT: '#a31718',
    EXCHANGE_RATES: '#BB4985',
    CURRENCY_CONVERTER: '#F881BC',
    CHANGES_LOGS: '#006593',
    CONTACT: '#0085B5',
    SICK_PAY: '#ffa483',
    CHART1: '#e32514',
    CHART2: '#edb113',
    CHART3: '#FF9E8D',
    CHART4: '#ed6d13',
    CHART5: '#BB4985',
    CHART6: '#a31718',
    CHART7: '#00A7D9',
  },
}
