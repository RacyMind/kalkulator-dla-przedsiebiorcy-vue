import { uid } from 'quasar'

export default {
  getCid () {
    // We need an unique identifier for this session
    // We store it in a localStorage, but you may use cookies, too
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  },

  logEvent (category, action, label, value = null) {
    if(!process.env.DEV) {
      window.dataLayer.push({
        action: action,
        category: category,
        cid: this.getCid(),
        event: 'customEvent',
        label: label,
        value: value,
      })
    }
  },

  logPage (path) {
    if(!process.env.DEV) {
      window.dataLayer.push({
        cid: this.getCid(),
        event: 'customPageView',
        path: path,
      })
    }
  },

}
