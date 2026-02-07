<template>
  <div>
    <div class="full-width bg-surface q-pa-md text-grey text-caption">
      <p class="q-mb-sm">Twórca aplikacji dokłada wszelkich starań, by obliczenia były poprawne. Niemniej wszelkie obliczenia mają charakter orientacyjny. Twórca nie ponosi odpowiedzialności za ewentualne szkody powstałe podczas używania danych z aplikacji.</p>
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
          @click="eventStore.$reset()"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useEventStore} from 'stores/eventStore'
import Separator from 'components/partials/Separator.vue'

const eventStore = useEventStore()

</script>
