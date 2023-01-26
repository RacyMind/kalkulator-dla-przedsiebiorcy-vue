<template>
  <q-card style="width: auto; max-width: 600px">
    <q-card-section>
      <p class="text-justify">
        Cóż, tak się złozyło, że od urodzenia choruję na <a href="https://pl.wikipedia.org/wiki/Artrogrypoza"
                                                            target="_blank">Artrogrypozę</a> i poruszam  się na wózku. W tym roku planuję 2 duże "inwestycje" w ułatwianie sobie życia. Pierwszą rzeczą jest zakup wózka elektonicznego - Edge® 3 Stretto. Jego koszt to 71 350 zł. Maksymalna kwota refundacji przez PFRON i NFZ wynosi 30 000 zł. Ponad 40 tys zł muszę dołożyć samodzielnie.
      </p>
      <p class="text-justify">Kolejną istotną rzeczą jest budowa podjazdu do mieszkania. Wstępny kosztorys to 116 000 zł. Maksymalna refundacja przez PFRON wynosi do +/- 95 000 zł. Na budowę podjazdu będę musiał dołożyć przynajmniej 20 tys zł.</p>
      <p class="text-justify">Są to duże kwoty nawet dla programisty :-) A to tylko wydatek by nie być więźniem w mieszkaniu...</p>
      <p class="text-justify">Dlatego zdecydowałem się dodać informację o 1,5% w aplikacji.</p>
      <p class="text-justify">Jeżeli ktoś zdecyduje się wesprzeć twórcę kalkulatora, wielkie dzięki! :)</p>
      <p>
        KRS: 0000270809<br>
        Cel szczególny: Socha, 15548
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import ga from '../../logic/analytics'

ga.logEvent('Modal', 'Open', 'Wsparcie autora')
</script>
