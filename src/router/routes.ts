import { RouteRecordRaw } from 'vue-router'
import Error404 from 'pages/Error404.vue'

const routes: RouteRecordRaw[] = [
  {
    children: [
      { component: () => import('pages/Index.vue'), path: '' },
      { component: () => import('pages/Invoice.vue'), path: '/faktura-vat' },
      { component: () => import('pages/Investment.vue'), path: 'lokata' },
      { component: () => import('pages/Interest.vue'), path: 'odsetki' },
      { component: () => import('components//contractWork/pages/Index.vue'), path: 'umowa-o-dzielo' },
      { component: () => import('components/contractOfMandate/pages/Index.vue'), path: 'umowa-zlecenie' },
      { component: () => import('components/contractOfEmployment/pages/Index.vue'), path: 'umowa-o-prace' },
      { component: () => import('components/selfEmployment/pages/Index.vue'), path: 'samozatrudnienie' },
      { component: () => import('pages/ExchangeRates.vue'), path: 'kursy-walut' },
      { component: () => import('pages/Currency.vue'), path: 'kursy-walut/:currency' },
      { component: () => import('pages/CurrencyConverter.vue'), path: 'przelicznik-walut' },
      { component: () => import('pages/ChangeLogs.vue'), path: 'historia-zmian' },
      { component: () => import('pages/Contact.vue'), path: 'kontakt' },
      { component: () => import('components/sickPay/pages/Index.vue'), path: 'zasilek-chorobowy' },
      { component: () => import('components/salaryForUnusedHolidays/pages/Index.vue'), path: 'ekwiwalent-za-niewykorzystany-urlop' },
      { component: () => import('pages/CashRegisterLimit.vue'), path: 'limit-obrotu-dla-kasy-fiskalnej' },
      { component: () => import('components/unregisteredCompany/pages/Index.vue'), path: 'dzialalnosc-niezarejestrowana' },
      { component: () => import('pages/VatLimit.vue'), path: 'limit-zwolnienia-z-vat' },
      { component: () => import('components/partialZusContributions/pages/Index.vue'), path: 'skladki-zus-za-czesc-miesiaca' },
      { component: () => import('pages/Inflation.vue'), path: 'inflacja' },
      { component: () => import('pages/PurchasingPowerOfMoney.vue'), path: 'sila-nabywcza-pieniadza' },
      { component: () => import('components/salaryStats/pages/Index.vue'), path: 'informacje-o-wynagrodzeniu' },
      { component: () => import('pages/Terms.vue'), path: 'terminy-w-us-zus-pfron' },
      { component: () => import('components/privacyPolicy/Index.vue'), path: 'polityka-prywatnosci' },
      { component: () => import('components/b2bComparator/pages/Index.vue'), path: 'porownywarka-b2b' },
      { component: () => import('components/accountingWithSpouse/pages/Index.vue'), path: 'rozliczenie-z-malzonkiem' },
      { component: () => import('components/realBoughtCosts/pages/Index.vue'), path: 'rzeczywisty-koszt-zakupu' },
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
