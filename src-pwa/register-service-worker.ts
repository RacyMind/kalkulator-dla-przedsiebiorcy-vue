import { register } from 'register-service-worker';
import { Notify } from 'quasar';

register(process.env.SERVICE_WORKER_FILE, {
  ready() {},

  registered() {},

  cached() {},

  updatefound() {},

  updated(registration) {
    Notify.create({
      message: 'Nowa wersja kalkulatora jest dostępna.',
      icon: 'cloud_download',
      color: 'primary',
      timeout: 0,
      actions: [
        {
          label: 'Odśwież',
          color: 'white',
          handler: () => {
            const waiting = registration.waiting;
            if (waiting) {
              waiting.postMessage({ type: 'SKIP_WAITING' });
              waiting.addEventListener('statechange', (e) => {
                if ((e.target as ServiceWorker).state === 'activated') {
                  window.location.reload();
                }
              });
            } else {
              window.location.reload();
            }
          },
        },
      ],
    });
  },

  offline() {},

  error() {},
});
