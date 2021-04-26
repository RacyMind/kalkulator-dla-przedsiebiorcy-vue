import ga from '../logic/analytics.js'

export default ({ router }) => {
  router.afterEach((to, from) => {
    const path = 'app' + to.path
    ga.logPage(path)
  })
}
