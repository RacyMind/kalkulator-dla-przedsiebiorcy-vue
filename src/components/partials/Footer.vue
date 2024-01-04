<template>
  <div class="text-teal-7 q-pt-md text-center">
    <div>
      <q-btn
        class="q-mb-sm"
        color="teal-7"
        @click="openModal = true">
        <q-icon
          name="o_favorite_border"
          class="q-mr-sm" />
        Wesprzyj projekt
      </q-btn>
      <div style="font-size: 0.75rem;">
        &copy; 2011-{{ currentYear }} Kalkulator finansowy<br>
        Wersja {{ appVersion }}<br>
        Stworzone przez <a
          href="https://www.linkedin.com/in/%C5%82ukasz-socha-30083841/"
          class="text-teal-7"
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
