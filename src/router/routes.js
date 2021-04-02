
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'faktura-vat', component: () => import('pages/Invoice.vue') },
      { path: 'odsetki', component: () => import('pages/Interest.vue') },
      { path: 'umowa-o-dzielo', component: () => import('pages/ContractWork.vue') },
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
