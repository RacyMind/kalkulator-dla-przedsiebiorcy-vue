<template>
  <q-card style="width: auto; max-width: 500px">
    <q-card-section class="text-center q-pb-none">
      <q-icon :name="outlinedFavorite"
              size="32px"
              color="red-7" />
      <div class="text-h6 q-mt-xs">Przekaż 1,5% podatku</div>
    </q-card-section>
    <q-card-section>
      <p class="text-justify">
        Od urodzenia choruję na <a href="https://pl.wikipedia.org/wiki/Artrogrypoza"
                                   target="_blank">Artrogrypozę</a> i poruszam się na wózku.
        Niepełnosprawność generuje dodatkowe koszty — wózek elektryczny, sprzęt ułatwiaący funkcjonowanie, rehabilitacja.
      </p>
      <p class="text-justify q-mb-md">
        Jeśli kalkulator jest dla Ciebie przydatny, możesz przekazać 1,5% podatku. To nic nie kosztuje, a bardzo pomaga!
      </p>
      <q-card flat
              bordered
              class="q-pa-md text-center"
              :class="Dark.isActive ? 'bg-grey-9 text-grey-2' : 'bg-grey-1 text-grey-9'">
        <div class="text-weight-bold">KRS: 0000270809</div>
        <div class="text-weight-bold">Cel szczególny: Socha, 15548</div>
      </q-card>
      <p class="text-center q-mt-md q-mb-none text-caption">
        Wielkie dzięki za wsparcie!
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import {Dark} from 'quasar'
import ga from '../../logic/analytics'
import {outlinedFavorite} from 'src/icons'

ga.logEvent('Modal', 'Open', 'Wsparcie autora')
</script>
