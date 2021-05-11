// default src/store/index.js content:
import { createStore } from 'vuex'
// import example from './module-example'
import modules from './modules'
export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      ...modules,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  })

  return Store
}
