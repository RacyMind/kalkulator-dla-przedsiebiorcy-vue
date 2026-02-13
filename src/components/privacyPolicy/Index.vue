<template>
  <ModulePageLayout class="c-app" single-column>
    <template #form>
      <div class="q-pa-md">
        <p class="text-h6 text-weight-bold">1. Administrator danych</p>
        <p>
          Administratorem danych osobowych jest Łukasz Socha. W sprawach
          dotyczących prywatności możesz skontaktować się przez:
          <a href="mailto:kontakt@lukasz-socha.pl">kontakt@lukasz-socha.pl</a>.
        </p>

        <p class="text-h6 text-weight-bold">2. Zakres przetwarzania danych</p>
        <p>
          Aplikacja przetwarza dane wprowadzone w formularzach kalkulatorów
          lokalnie w pamięci urządzenia i nie przesyła ich na serwer twórcy.
          Dodatkowo, po wyrażeniu zgody, używana jest analityka Google Analytics
          4 (web) oraz Firebase Analytics (Android), aby mierzyć sposób
          korzystania z aplikacji.
        </p>

        <p class="text-h6 text-weight-bold">3. Cele i podstawy prawne</p>
        <p>
          Dane analityczne przetwarzane są w celu rozwoju i poprawy działania
          aplikacji. Podstawą prawną jest zgoda użytkownika (art. 6 ust. 1 lit.
          a RODO). Zgoda jest dobrowolna i może zostać wycofana w dowolnym
          momencie.
        </p>

        <p class="text-h6 text-weight-bold">
          4. Zarządzanie zgodą na analitykę
        </p>
        <p>
          Aktualny status zgody analitycznej:
          <strong>{{ analyticsConsentStatusLabel }}</strong>
        </p>
        <p class="text-caption">
          Zmiana decyzji działa natychmiast. Po wycofaniu zgody na Androidzie
          resetowane są lokalne dane analityczne aplikacji.
        </p>
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-sm-auto">
            <q-btn
              color="primary"
              unelevated
              label="Akceptuję analityczne"
              @click="grantAnalyticsConsent"
            />
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              color="primary"
              outline
              label="Odrzucam analityczne"
              @click="denyAnalyticsConsent"
            />
          </div>
        </div>

        <p class="text-h6 text-weight-bold">5. Odbiorcy danych</p>
        <p>
          Dostawcami narzędzi analitycznych są Google Ireland Limited oraz
          podmioty z grupy Google. W związku z korzystaniem z tych usług dane
          mogą być przekazywane poza Europejski Obszar Gospodarczy na podstawie
          odpowiednich mechanizmów prawnych, w tym standardowych klauzul
          umownych.
        </p>

        <p class="text-h6 text-weight-bold">6. Okres przechowywania</p>
        <p>
          Dane analityczne są przechowywane przez okres wynikający z ustawień
          retencji skonfigurowanych w usługach Google Analytics i Firebase
          Analytics. Dane wpisywane do kalkulatorów pozostają lokalnie na
          urządzeniu użytkownika do czasu ich usunięcia.
        </p>

        <p class="text-h6 text-weight-bold">7. Twoje prawa</p>
        <p>
          Przysługuje Ci prawo dostępu do danych, sprostowania, usunięcia,
          ograniczenia przetwarzania, przenoszenia danych, cofnięcia zgody oraz
          wniesienia skargi do Prezesa UODO.
        </p>

        <p class="text-h6 text-weight-bold">8. Dokumenty powiązane</p>
        <p>
          Zasady korzystania z aplikacji opisuje
          <router-link to="/regulamin">Regulamin</router-link>.
        </p>

        <p class="text-caption q-mt-lg">
          Ostatnia aktualizacja: 13 lutego 2026 r.
        </p>
      </div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import {
  acceptAnalytics,
  getConsentState,
  rejectAnalytics,
} from 'src/logic/consent'

const breadcrumbStore = useBreadcrumbStore()
const consentState = ref(getConsentState())

breadcrumbStore.items = [
  {
    name: 'Polityka prywatności',
  },
]

const refreshConsentState = () => {
  consentState.value = getConsentState()
}

const analyticsConsentStatusLabel = computed(() => {
  const consent = consentState.value?.analyticsStorage
  if (consent === 'granted') {
    return 'zaakceptowana'
  }
  if (consent === 'denied') {
    return 'odrzucona'
  }
  return 'brak decyzji'
})

const grantAnalyticsConsent = async () => {
  await acceptAnalytics('settings')
  refreshConsentState()
}

const denyAnalyticsConsent = async () => {
  await rejectAnalytics('settings')
  refreshConsentState()
}
</script>
