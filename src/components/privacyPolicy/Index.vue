<template>
  <ModulePageLayout class="c-app"
                    single-column>
    <template #form>
      <div class="q-pa-md">
        <p class="text-h6 text-weight-bold">1. Wprowadzenie</p>
        <p>Dziękuję za korzystanie z Kalkulatora Finansowego. Niniejsza polityka prywatności ma na celu poinformowanie użytkowników o tym, w jaki sposób zbierane, używane, przechowywane i chronione są ich dane osobowe. Proszę o dokładne zapoznanie się z poniższymi informacjami.</p>

        <p class="text-h6 text-weight-bold">2. Administrator danych osobowych</p>
        <p>Administratorem danych osobowych jest Łukasz Socha. W przypadku pytań dotyczących prywatności danych można skontaktować się pod adresem e-mail: <a href="mailto:kontakt@lukasz-socha.pl">kontakt@lukasz-socha.pl</a>.</p>

        <p class="text-h6 text-weight-bold">3. Rodzaje danych zbieranych przez Kalkulator Finansowy</p>
        <p>
          a) <strong>Dane zbierane automatycznie:</strong><br>
          Kalkulator Finansowy używa narzędzia Google Analytics do zbierania informacji o sposobie korzystania z aplikacji. Te dane obejmują m.in. adres IP, rodzaj przeglądarki, czas spędzony na stronie, odwiedzone podstrony. Te informacje są używane w celu analizy i ulepszania usługi.
        </p>
        <p>
          b) <strong>Dane wprowadzone przez użytkownika:</strong><br>
          Kalkulator Finansowy umożliwia wprowadzenie danych finansowych w celu skorzystania z funkcji kalkulatora wynagrodzeń. Te informacje są przechowywane lokalnie na Twoim urządzeniu i nie są przesyłane na serwer.
        </p>

        <p class="text-h6 text-weight-bold">4. Cel zbierania i przetwarzania danych</p>
        <p>
          a) <strong>Google Analytics:</strong><br>
          Dane zbierane przez Google Analytics są używane w celu analizy ruchu na stronie, poprawy doświadczenia użytkownika i dostosowania treści do indywidualnych potrzeb użytkowników.
        </p>
        <p>
          b) <strong>Dane użytkownika:</strong><br>
          Dane wprowadzone przez użytkownika są używane wyłącznie w celu obsługi funkcji kalkulatora wynagrodzeń i nie są udostępniane osobom trzecim ani przesyłane na zewnętrzne serwery.
        </p>

        <p class="text-h6 text-weight-bold">5. Pamięć urządzenia</p>
        <p>Wprowadzone przez użytkownika dane są przechowywane lokalnie w pamięci urządzenia. Nie ma możliwości dostępu do tych danych przez inne aplikacje lub strony internetowe.</p>

        <p class="text-h6 text-weight-bold">6. Prawa użytkownika</p>
        <p>Użytkownik ma prawo żądania dostępu, poprawiania, usunięcia lub ograniczenia przetwarzania swoich danych osobowych. W przypadku pytań dotyczących prywatności danych, proszę o kontakt pod adresem e-mail: <a href="mailto:kontakt@lukasz-socha.pl">kontakt@lukasz-socha.pl</a>.</p>

        <p class="text-h6 text-weight-bold">7. Zmiany w polityce prywatności</p>
        <p>Niniejsza polityka prywatności może podlegać aktualizacjom. Wszelkie zmiany będą publikowane na tej stronie.</p>
      </div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">

import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Polityka prywatności',
  },
]
</script>
