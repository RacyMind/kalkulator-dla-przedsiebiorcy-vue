<template>
  <div class="q-pt-md text-center text-grey">
    <div>
      <q-btn
        class="q-mb-sm lt-md"
        color="red-7"
        rounded
        unelevated
        @click="openModal = true">
        <q-icon
          name="o_favorite"
          class="q-mr-sm" />
        WESPRZYJ PROJEKT
      </q-btn>
      <div style="font-size: 0.75rem;">
        &copy; 2011-{{ currentYear }} Kalkulator finansowy<br>
        Wersja {{ appVersion }}<br>
        Stworzone przez <a
          href="https://lukasz-socha.pl"
          class="text-grey"
          target="_blank">
          Łukasz Socha
        </a>
      </div>
    </div>

    <q-dialog v-model="openModal">
      <SupportProject />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import SupportProject from 'components/partials/SupportProject.vue'
import logs from 'components/changeLogs/logs'

const openModal = ref(false)
const currentYear = new Date().getFullYear()

const appVersion = logs[0].version
</script>
