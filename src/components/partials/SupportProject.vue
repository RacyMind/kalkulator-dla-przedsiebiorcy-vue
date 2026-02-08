<template>
  <q-card style="width: auto; max-width: 500px">
    <q-card-section class="text-center q-pb-none">
      <q-icon :name="outlinedFavorite" size="32px" color="red-7" />
      <div class="text-h6 q-mt-xs">Wesprzyj projekt</div>
    </q-card-section>
    <q-card-section>
      <p class="text-justify">
        Kalkulator finansowy to darmowe narzędzie, które rozwijam po godzinach.
        Dzięki Twojemu wsparciu mogę dodawać nowe funkcje i utrzymywać aktualne
        dane!
      </p>
      <div class="text-center q-mb-md">
        <q-btn
          label="Wesprzyj na zrzutka.pl"
          no-caps
          style="width: 80%; max-width: 250px"
          color="red-7"
          unelevated
          rounded
          type="a"
          href="https://zrzutka.pl/r4awyd"
          target="_blank"
        />
      </div>
      <q-separator class="q-my-md" />
      <p class="text-justify text-caption q-mb-sm">
        Podziel się z innymi – pomóż im oszczędzać:
      </p>
      <div class="row justify-center q-gutter-sm q-mb-md">
        <q-btn
          :icon="mdiFacebook"
          round
          flat
          color="primary"
          type="a"
          target="_blank"
          :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
        />
        <q-btn
          :icon="mdiLinkedin"
          round
          flat
          color="primary"
          type="a"
          target="_blank"
          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${url}`"
        />
        <q-btn
          :icon="xIcon"
          round
          flat
          color="primary"
          type="a"
          target="_blank"
          :href="`https://x.com/intent/tweet?url=${url}&text=Twój darmowy kalkulator wynagrodzeń – sprawdź ile zarobisz na rękę!&hashtags=kalkulator,finanse,wynagrodzenie,B2B`"
        />
      </div>
      <p class="q-mb-none text-center text-caption">
        Jesteś programistą? Zapraszam na
        <a
          href="https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue"
          target="_blank"
          >GitHuba</a
        >.<br />
        Kalkulator był, jest i będzie darmowy.
      </p>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useConstantsStore } from 'stores/constantsStore';
import ga from '../../logic/analytics';
import { mdiFacebook, mdiLinkedin } from '@quasar/extras/mdi-v7';
import { outlinedFavorite } from 'src/icons';

const constants = useConstantsStore();

const xIcon =
  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';

const url = 'https://kalkulatorfinansowy.app/app';
ga.logEvent('Modal', 'Open', 'Wsparcie');
</script>
