<template>
  <q-card style="width: auto; max-width: 500px">
    <q-card-section class="text-center q-pb-none">
      <q-icon name="o_favorite"
              size="32px"
              color="red-7" />
      <div class="text-h6 q-mt-xs">Wesprzyj projekt</div>
    </q-card-section>
    <q-card-section>
      <p class="text-justify">
        Kalkulator finansowy rozwijam hobbystycznie po godzinach.
        Jeżeli uważasz to narzędzie za wartościowe, możesz wesprzeć jego rozwój!
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
          target="_blank"/>
      </div>
      <q-separator class="q-my-md" />
      <p class="text-justify text-caption q-mb-sm">
        Możesz też pomóc udostępniając kalkulator:
      </p>
      <div class="row justify-center q-gutter-sm q-mb-md">
        <q-btn
          icon="mdi-facebook"
          round
          flat
          color="primary"
          type="a"
          target="_blank"
          :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
        />
        <q-btn
          icon="mdi-linkedin"
          round
          flat
          color="primary"
          type="a"
          target="_blank"
          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${constants.app.name}`"
        />
        <q-btn
          icon="mdi-twitter"
          round
          flat
          color="primary"
          type="a"
          target="_blank"
          :href="`http://twitter.com/share?url=${url}&text=${constants.app.name}&hashtags=wynagrodzenie,finanse,kalkulator`"
        />
      </div>
      <p class="q-mb-none text-center text-caption">
        Jesteś programistą? Zapraszam na <a href="https://github.com/RacyMind/kalkulator-dla-przedsiebiorcy-vue"
                                            target="_blank">GitHuba</a>.<br>
        Kalkulator był, jest i będzie darmowy.
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
