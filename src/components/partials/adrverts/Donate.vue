<template>
  <div>
    <div>
      Rozwój tej aplikacji to setki godzin pracy. Dodaj energii na dalszy rozwój stawiając kawę :-)
    </div>
    <q-btn
      label="Wesprzyj projekt"
      no-caps
      class="q-mt-sm"
      style="width: 75%;max-width:180px"
      color="primary"
      outline
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
