
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'faktura-vat', component: () => import('pages/Invoice.vue') },
      { path: 'lokata', component: () => import('pages/Investment.vue') },
      { path: 'odsetki', component: () => import('pages/Interest.vue') },
      { path: 'umowa-o-dzielo', component: () => import('pages/ContractWork.vue') },
      { path: 'umowa-zlecenie', component: () => import('pages/ContractOfMandate.vue') },
      { path: 'umowa-o-prace', component: () => import('pages/ContractOfEmployment') },
      { path: 'samozatrudnienie', component: () => import('pages/SelfEmployment') },
      { path: 'kursy-walut', component: () => import('pages/ExchangeRates') },
      { path: 'przelicznik-walut', component: () => import('pages/CurrencyConverter') },
      { path: 'historia-zmian', component: () => import('pages/ChangeLogs') },
      { path: 'kontakt', component: () => import('pages/Contact') },
      { path: 'zasilek-chorobowy', component: () => import('pages/SickPay') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
