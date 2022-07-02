import Error404 from 'pages/Error404'

const routes = [
  {
    children: [
      { component: () => import('pages/Index.vue'), path: '' },
      { component: () => import('pages/Invoice.vue'), path: 'faktura-vat' },
      { component: () => import('pages/Investment.vue'), path: 'lokata' },
      { component: () => import('pages/Interest.vue'), path: 'odsetki' },
      { component: () => import('pages/ContractWork.vue'), path: 'umowa-o-dzielo' },
      { component: () => import('pages/ContractOfMandate.vue'), path: 'umowa-zlecenie' },
      { component: () => import('pages/ContractOfEmployment'), path: 'umowa-o-prace' },
      { component: () => import('pages/SelfEmployment'), path: 'samozatrudnienie' },
      { component: () => import('pages/ExchangeRates'), path: 'kursy-walut' },
      { component: () => import('pages/Currency'), path: 'kursy-walut/:currency' },
      { component: () => import('pages/CurrencyConverter'), path: 'przelicznik-walut' },
      { component: () => import('pages/ChangeLogs'), path: 'historia-zmian' },
      { component: () => import('pages/Contact'), path: 'kontakt' },
      { component: () => import('pages/SickPay'), path: 'zasilek-chorobowy' },
      { component: () => import('pages/CashRegisterLimit'), path: 'limit-obrotu-dla-kasy-fiskalnej' },
      { component: () => import('pages/UnregisteredCompany'), path: 'dzialalnosc-niezarejestrowana' },
      { component: () => import('pages/VatLimit'), path: 'limit-zwolnienia-z-vat' },
      { component: () => import('pages/PartialZusContributions'), path: 'skladki-zus-za-czesc-miesiaca' },
      { component: () => import('pages/AccountingWithSpouse'), path: 'rozliczenie-z-malzonkiem' },
      { component: () => import('pages/Inflation'), path: 'inflacja' },
      { component: () => import('pages/PurchasingPowerOfMoney'), path: 'sila-nabywcza-pieniadza' },
      { component: () => import('pages/SalaryStats'), path: 'informacje-o-wynagrodzeniu' },
      { component: () => import('pages/Terms'), path: 'terminy-w-us-zus-pfron' },
    ],
    component: () => import('layouts/MainLayout.vue'),
    path: '/',
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    component: Error404,
    path: '/:catchAll(.*)*',
  },
]

export default routes
