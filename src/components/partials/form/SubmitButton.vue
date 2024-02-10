<template>
  <div>
    <div class="full-width bg-white q-pa-md text-grey">
      <p>Twórca aplikacji dokłada wszelkich starań, by obliczenia były poprawne. Niemniej wszelkie obliczenia mają charakter orientacyjny. Twórca nie ponosi odpowiedzialności za ewentualne szkody powstałe podczas używania danych z aplikacji.</p>
      <p class="q-mb-none">
        Korzystając z aplikacji akceptujesz <router-link class="text-grey "
                                                         style="text-decoration: underline;"
                                                         to="/polityka-prywatnosci">
          politykę prywatności
        </router-link>
      </p>
    </div>
    <Separator />
    <div class="row">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="teal-4"
          size="md"
          label="Oblicz"
          square
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Separator from 'components/partials/Separator.vue'
</script>
