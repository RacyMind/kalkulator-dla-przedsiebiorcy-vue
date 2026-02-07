<template>
  <div>
    <div>
      Ten kalkulator jest darmowy dzięki Twojemu wsparciu. Pomóż go rozwijać!
    </div>
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
import {ref} from 'vue'
import SupportProject from 'components/partials/SupportProject.vue'

const openModal = ref(false)
</script>
