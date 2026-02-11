<template>
  <div v-if="!premiumStore.isPremiumActive">
    <div>Kalkulator jest i zawsze będzie darmowy. Wesprzyj jego rozwój!</div>
    <q-btn
      label="Wesprzyj twórcę"
      no-caps
      class="q-mt-sm"
      style="width: 80%; max-width: 220px"
      color="red-7"
      unelevated
      rounded
      @click="openModal = true"
    />

    <q-dialog v-model="openModal">
      <SupportProject />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import SupportProject from 'components/partials/SupportProject.vue'
import { usePremiumStore } from 'stores/premiumStore'

const openModal = ref(false)
const premiumStore = usePremiumStore()
</script>
