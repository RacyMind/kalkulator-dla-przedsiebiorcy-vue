<template>
  <ModulePageLayout class="c-app" single-column>
    <template #form>
      <div class="q-pa-md">
        <p class="text-h5 text-weight-bold q-mb-md">Regulamin aplikacji</p>

        <p class="text-h6 text-weight-bold">1. Postanowienia ogólne</p>
        <p>
          Regulamin określa zasady korzystania z aplikacji „Kalkulator
          finansowy” dostępnej w wersji web oraz Android.
        </p>

        <p class="text-h6 text-weight-bold">2. Usługodawca</p>
        <p>
          Usługodawcą i twórcą aplikacji jest Łukasz Socha. Kontakt:
          <a href="mailto:kontakt@lukasz-socha.pl">kontakt@lukasz-socha.pl</a>.
        </p>

        <p class="text-h6 text-weight-bold">3. Zakres usługi</p>
        <p>
          Aplikacja umożliwia wykonywanie kalkulacji finansowych, podatkowych i
          składkowych na podstawie danych wprowadzonych przez użytkownika.
        </p>

        <p class="text-h6 text-weight-bold">4. Charakter wyników</p>
        <p>
          Wyniki mają charakter informacyjny i orientacyjny. Nie stanowią porady
          podatkowej, prawnej ani księgowej i nie zastępują indywidualnej
          konsultacji ze specjalistą.
        </p>

        <p class="text-h6 text-weight-bold">5. Odpowiedzialność</p>
        <p>
          Twórca dokłada należytej staranności, aby dane i algorytmy były
          aktualne i poprawne, jednak nie gwarantuje pełnej bezbłędności
          obliczeń. Użytkownik korzysta z aplikacji na własną odpowiedzialność.
        </p>

        <p class="text-h6 text-weight-bold">6. Obowiązki użytkownika</p>
        <p>
          Użytkownik zobowiązuje się korzystać z aplikacji zgodnie z prawem i
          dobrymi obyczajami, w szczególności nie podejmować działań
          naruszających bezpieczeństwo aplikacji.
        </p>

        <p class="text-h6 text-weight-bold">7. Prawa autorskie</p>
        <p>
          Aplikacja, jej kod, grafiki i treści stanowią własność intelektualną
          twórcy lub podmiotów współpracujących i podlegają ochronie prawnej.
        </p>

        <p class="text-h6 text-weight-bold">8. Reklamacje i zgłoszenia</p>
        <p>
          Błędy, uwagi i reklamacje dotyczące działania aplikacji można zgłaszać
          przez formularz kontaktowy lub na adres
          <a href="mailto:kontakt@lukasz-socha.pl">kontakt@lukasz-socha.pl</a>.
          Zgłoszenia rozpatrywane są bez zbędnej zwłoki.
        </p>

        <p class="text-h6 text-weight-bold">9. Zmiany regulaminu</p>
        <p>
          Regulamin może być aktualizowany wraz ze zmianą funkcjonalności
          aplikacji lub przepisów prawa. Aktualna wersja jest publikowana w
          aplikacji.
        </p>

        <p class="text-h6 text-weight-bold">10. Prawo właściwe</p>
        <p>
          Do korzystania z aplikacji stosuje się prawo polskie. W sprawach
          nieuregulowanych regulaminem zastosowanie mają właściwe przepisy
          prawa, w tym przepisy Kodeksu cywilnego oraz RODO.
        </p>

        <p class="text-caption q-mt-lg">Obowiązuje od: 13 lutego 2026 r.</p>
      </div>
    </template>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Regulamin',
  },
]
</script>
