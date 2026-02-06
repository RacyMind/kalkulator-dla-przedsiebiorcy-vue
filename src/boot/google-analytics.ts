import type { Router, RouteLocationNormalized } from 'vue-router'
import ga from '../logic/analytics.js'

export default ({router}: {router: Router}) => {
  router.afterEach((to: RouteLocationNormalized) => {
    const path = 'app' + to.path
    ga.logPage(path)
  })
}
