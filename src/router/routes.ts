import { RouteRecordRaw } from 'vue-router'
import Error404 from 'pages/Error404.vue'

const routes: RouteRecordRaw[] = [
  {
    children: [
      { component: () => import('pages/Index.vue'), path: '' },
      { component: () => import('components/invoice/pages/Index.vue'), path: '/faktura-vat' },
      { component: () => import('components/investment/pages/Index.vue'), path: 'lokata' },
      { component: () => import('components/interest/pages/Index.vue'), path: 'odsetki' },
      { component: () => import('components/contractWork/pages/Index.vue'), path: 'umowa-o-dzielo' },
      { component: () => import('components/contractOfMandate/pages/Index.vue'), path: 'umowa-zlecenie' },
      { component: () => import('components/contractOfEmployment/pages/Index.vue'), path: 'umowa-o-prace' },
      { component: () => import('components/selfEmployment/pages/Index.vue'), path: 'samozatrudnienie' },
      { component: () => import('components/exchangeRates/pages/Index.vue'), path: 'kursy-walut' },
      { component: () => import('components/exchangeRates/pages/Currency.vue'), path: 'kursy-walut/:currency' },
      { component: () => import('components/currencyConverter/pages/Index.vue'), path: 'przelicznik-walut' },
      { component: () => import('components/changeLogs/pages/Index.vue'), path: 'historia-zmian' },
      { component: () => import('components/contact/pages/Index.vue'), path: 'kontakt' },
      { component: () => import('components/sickPay/pages/Index.vue'), path: 'zasilek-chorobowy' },
      { component: () => import('components/salaryForUnusedHolidays/pages/Index.vue'), path: 'ekwiwalent-za-niewykorzystany-urlop' },
      { component: () => import('components/cashRegisterLimit/pages/Index.vue'), path: 'limit-obrotu-dla-kasy-fiskalnej' },
      { component: () => import('components/unregisteredCompany/pages/Index.vue'), path: 'dzialalnosc-niezarejestrowana' },
      { component: () => import('components/vatLimit/pages/Index.vue'), path: 'limit-zwolnienia-z-vat' },
      { component: () => import('components/partialZusContributions/pages/Index.vue'), path: 'skladki-zus-za-czesc-miesiaca' },
      { component: () => import('components/inflation/pages/Index.vue'), path: 'inflacja' },
      { component: () => import('components/inflation/pages/PurchasingPowerOfMoney.vue'), path: 'sila-nabywcza-pieniadza' },
      { component: () => import('components/salaryStats/pages/Index.vue'), path: 'informacje-o-wynagrodzeniu' },
      { component: () => import('components/terms/pages/Index.vue'), path: 'terminy-w-us-zus-pfron' },
      { component: () => import('components/privacyPolicy/Index.vue'), path: 'polityka-prywatnosci' },
      { component: () => import('components/b2bComparator/pages/Index.vue'), path: 'porownywarka-b2b' },
      { component: () => import('components/accountingWithSpouse/pages/Index.vue'), path: 'rozliczenie-z-malzonkiem' },
      { component: () => import('components/realBoughtCosts/pages/Index.vue'), path: 'rzeczywisty-koszt-zakupu' },
      { component: () => import('components/polishBonds/pages/Index.vue'), path: 'obligacje-skarbowe' },
      { component: () => import('components/ikzeTaxRelief/pages/Index.vue'), path: 'ulga-podatkowa-ikze' },
      { component: () => import('components/ikeSavings/pages/IkeSavingsPage.vue'), path: 'kalkulator-ike' },
      { component: () => import('components/rentalProfit/pages/Index.vue'), path: 'zysk-z-najmu' },
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
