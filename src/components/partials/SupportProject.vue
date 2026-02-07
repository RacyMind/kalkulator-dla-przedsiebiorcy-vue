<template>
  <q-card style="width: auto; max-width: 600px">
    <q-card-section>
      <p class="text-justify">
        Cześć! Kalkulator finansowy rozwijam hobbystycznie w tak zwanych „po
        godzinach”. W ramach projektu rozwijam swoją i Twoją wiedzę księgową. Jeżeli uważasz to narzędzie za
        wartościowe, możesz wsesprzeć projekt na zrzutka.pl :)
      </p>
      <q-btn
        label="Link do zrzutki"
        no-caps
        style="width: 75%;max-width:180px"
        color="primary"
        type="a"
        href="https://zrzutka.pl/r4awyd"
        class="q-mb-md q-mx-auto text-center block"
        target="_blank"/>
      <p class="text-justify">
        Będzie mi miło jak udostępnisz kalkulator finansowy i pomożesz w jego promocji.
      </p>
      <div class="column items-center">
        <q-btn
          label="Facebook"
          no-caps
          class="q-mb-sm"
          style="width: 75%;max-width:180px"
          color="primary"
          outline
          type="a"
          target="_blank"
          :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
        />
        <q-btn
          label="LinkedIn"
          no-caps
          class="q-mb-sm"
          style="width: 75%;max-width:180px"
          color="primary"
          outline
          type="a"
          target="_blank"
          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${constants.APP.NAME}`"
        />
        <q-btn
          label="Twitter"
          no-caps
          class="q-mb-md"
          style="width: 75%;max-width:180px"
          color="primary"
          outline
          type="a"
          target="_blank"
          :href="`http://twitter.com/share?url=${url}&text=${constants.APP.NAME}&hashtags=wynagrodzenie,finanse,kalkulator`"
        />
      </div>
      <p  class="q-mb-none text-justify">
        Jesteś programistą? Możesz wziąć aktywny udział w tworzeniu aplikacji. Zapraszam na <a href="https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue">GitHuba</a>.
      </p>
      <p  class="q-mb-none text-justify">
        Dzięki za wsparcie! Kalkulator był, jest i będzie darmowy.
      </p>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import {useConstantsStore} from 'stores/constantsStore'
import ga from '../../logic/analytics'

const constants = useConstantsStore()

const url = 'https://kalkulatorfinansowy.app'
ga.logEvent('Modal', 'Open', 'Wsparcie')
</script>
