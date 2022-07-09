import {Notify} from 'quasar'
import {register} from 'register-service-worker'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {

  cached(/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  error(/* err */) {
    // console.error('Error during service worker registration:', err)
  },

  offline() {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  ready(/* registration */) {
    // console.log('Service worker is active.')
  },

  registered(/* registration */) {
    // console.log('Service worker has been registered.')
  },

  // The registrationOptions object will be passed as the second argument
// to ServiceWorkerContainer.register()
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter
  registrationOptions: {scope: './'},

  updated(/* registration */) {
    Notify.create({
      closeBtn: 'Odśwież',
      icon: 'cloud_download',
      message: 'Nowa wersja kalkulatora jest dostępna. Odśwież, by  wczytać',
      onDismiss() {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          for (const registration of registrations) {
            registration.update()
          }
        })
        location.reload(true)
      },
      timeout: 10000,
    })
    // console.log('Service worker has been updated.')
  },

  updatefound(/* registration */) {
    // console.log('New content is downloading.')
  },
})
