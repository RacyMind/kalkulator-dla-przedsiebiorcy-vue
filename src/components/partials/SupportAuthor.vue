<template>
  <q-card style="width: auto; max-width: 600px">
    <q-card-section>
      <p class="text-justify">
        Cóż, tak się złożyło, że od urodzenia choruję na <a href="https://pl.wikipedia.org/wiki/Artrogrypoza"
                                                            target="_blank">Artrogrypozę</a> i poruszam  się na wózku. Niestety niepełnosprawność generuje dodatkowe koszty życia jak chociażby zakup wózka elektrycznego czy opłacenie fizjoterapii.
      </p>
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
