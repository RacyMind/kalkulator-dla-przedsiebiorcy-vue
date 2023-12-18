import { RouteRecordRaw } from 'vue-router'
import Error404 from 'pages/Error404.vue'

const routes: RouteRecordRaw[] = [
  {
    children: [
      { component: () => import('pages/Index.vue'), path: '' },
      { component: () => import('pages/Invoice.vue'), path: '/faktura-vat' },
      { component: () => import('pages/Investment.vue'), path: 'lokata' },
      { component: () => import('pages/Interest.vue'), path: 'odsetki' },
      { component: () => import('pages/ContractWork.vue'), path: 'umowa-o-dzielo' },
      { component: () => import('components/contractOfMandate/pages/Index.vue'), path: 'umowa-zlecenie' },
      { component: () => import('components/contractOfEmployment/pages/Index.vue'), path: 'umowa-o-prace' },
      { component: () => import('components/selfEmployment/pages/Index.vue'), path: 'samozatrudnienie' },
      { component: () => import('pages/ExchangeRates.vue'), path: 'kursy-walut' },
      { component: () => import('pages/Currency.vue'), path: 'kursy-walut/:currency' },
      { component: () => import('pages/CurrencyConverter.vue'), path: 'przelicznik-walut' },
      { component: () => import('pages/ChangeLogs.vue'), path: 'historia-zmian' },
      { component: () => import('pages/Contact.vue'), path: 'kontakt' },
      { component: () => import('pages/SickPay.vue'), path: 'zasilek-chorobowy' },
      { component: () => import('pages/SalaryForUnusedHolidays.vue'), path: 'ekwiwalent-za-niewykorzystany-urlop' },
      { component: () => import('pages/CashRegisterLimit.vue'), path: 'limit-obrotu-dla-kasy-fiskalnej' },
      { component: () => import('pages/UnregisteredCompany.vue'), path: 'dzialalnosc-niezarejestrowana' },
      { component: () => import('pages/VatLimit.vue'), path: 'limit-zwolnienia-z-vat' },
      { component: () => import('pages/PartialZusContributions.vue'), path: 'skladki-zus-za-czesc-miesiaca' },
      { component: () => import('pages/AccountingWithSpouse.vue'), path: 'rozliczenie-z-malzonkiem' },
      { component: () => import('pages/Inflation.vue'), path: 'inflacja' },
      { component: () => import('pages/PurchasingPowerOfMoney.vue'), path: 'sila-nabywcza-pieniadza' },
      { component: () => import('pages/SalaryStats.vue'), path: 'informacje-o-wynagrodzeniu' },
      { component: () => import('pages/Terms.vue'), path: 'terminy-w-us-zus-pfron' },
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
