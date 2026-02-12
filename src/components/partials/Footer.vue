<template>
  <div class="q-pt-md text-center footer-text">
    <div>
      <PremiumActions class="q-mb-sm lt-md" />
      <q-btn
        v-if="!premiumStore.isPremiumActive"
        class="q-mb-sm lt-md"
        color="red-7"
        rounded
        unelevated
        @click="openModal = true"
      >
        <q-icon :name="outlinedFavorite" class="q-mr-sm" />
        WESPRZYJ PROJEKT
      </q-btn>
      <div style="font-size: 0.75rem">
        &copy; 2011-{{ currentYear }} Kalkulator finansowy<br />
        Wersja {{ appVersion }}<br />
        Stworzone przez
        <a href="https://lukasz-socha.pl" class="footer-text" target="_blank">
          Łukasz Socha
        </a>
      </div>
    </div>

    <q-dialog v-if="!premiumStore.isPremiumActive" v-model="openModal">
      <SupportProject />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SupportProject from 'components/partials/SupportProject.vue'
import PremiumActions from 'components/partials/PremiumActions.vue'
import logs from 'components/changeLogs/logs'
import { outlinedFavorite } from 'src/icons'
import { usePremiumStore } from 'stores/premiumStore'

const openModal = ref(false)
const premiumStore = usePremiumStore()
const currentYear = new Date().getFullYear()

const appVersion = logs[0].version
</script>
