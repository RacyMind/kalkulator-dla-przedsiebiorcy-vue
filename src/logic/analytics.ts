import { uid } from 'quasar'

declare global {
  interface Window {
    dataLayer:any;
  }
}

export default {
  getCid () {
    // We need an unique identifier for this session
    // We store it in a localStorage, but you may use cookies, too
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  },

  logEvent (category:string, action:string, label:string, value = null) {
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
