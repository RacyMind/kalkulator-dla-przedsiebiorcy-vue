<template>
  <div class="q-mt-md">
    <div class="row">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="primary"
          size="md"
          label="Oblicz"
          rounded
          unelevated
          @click="eventStore.$reset()"
        />
      </div>
    </div>
    <div class="full-width q-pa-sm text-caption"
         style="color: var(--color-text-secondary)">
      <p class="q-mb-none">
        Obliczenia mają charakter orientacyjny.
        <router-link style="text-decoration: underline; color: var(--color-text-secondary)"
                     to="/polityka-prywatnosci">
          Polityka prywatności
        </router-link>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useEventStore} from 'stores/eventStore'

const eventStore = useEventStore()
</script>
