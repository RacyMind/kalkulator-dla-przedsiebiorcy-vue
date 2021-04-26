import { uid } from 'quasar'

export default {

  logEvent (category, action, label, value) {
    window.dataLayer.push({
      event: 'customEvent',
      category: category,
      action: action,
      label: label,
      value: value,
      cid: this.getCid(),
    })
  },

  logPage (path) {
    // Here you can preprocess the path, if needed
    window.dataLayer.push({
      event: 'customPageView',
      path: path,
      cid: this.getCid(),
    })
  },

  getCid () {
    // We need an unique identifier for this session
    // We store it in a localStorage, but you may use cookies, too
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  },

}
