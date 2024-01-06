<template>
  <q-page
    class="q-py-md full-width"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <slot></slot>
    </div>
    <Separator />
    <div class="full-width bg-white q-pa-md text-grey text-justify">
      <p>Twórca aplikacji dokłada wszelkich starań, by obliczenia były poprawne. Niemniej wszelkie obliczenia mają charakter orientacyjny. Twórca nie ponosi odpowiedzialności za ewentualne szkody powstałe podczas używania danych z aplikacji.</p>
      <p class="q-mb-none">
        Korzystając z aplikacji akceptujesz <router-link class="text-grey "
                                                         style="text-decoration: underline;"
                                                         to="/polityka-prywatnosci">
          politykę prywatności
        </router-link>
      </p>
    </div>
    <Footer/>
  </q-page>
</template>
<script setup lang="ts">
import Footer from 'components/partials/Footer.vue'
import Separator from 'components/partials/Separator.vue'
</script>
