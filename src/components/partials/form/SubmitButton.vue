<template>
  <div class="q-mt-md">
    <div class="row">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width submit-btn"
          color="primary"
          size="lg"
          label="Oblicz"
          unelevated
          style="border-radius: var(--radius-md)"
          @click="eventStore.$reset()"
        />
      </div>
    </div>
    <div
      class="full-width q-pa-sm text-caption"
      style="color: var(--color-text-secondary)"
    >
      <p class="q-mb-none">
        Twórca aplikacji dokłada wszelkich starań, by obliczenia były poprawne.
        Niemniej wszelkie obliczenia mają charakter orientacyjny. Twórca nie
        ponosi odpowiedzialności za ewentualne szkody powstałe podczas używania
        danych z aplikacji.<br />
        Korzystając z aplikacji akceptujesz
        <router-link
          style="text-decoration: underline; color: var(--color-text-secondary)"
          to="/polityka-prywatnosci"
        >
          politykę prywatności
        </router-link>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEventStore } from 'stores/eventStore';

const eventStore = useEventStore();
</script>
