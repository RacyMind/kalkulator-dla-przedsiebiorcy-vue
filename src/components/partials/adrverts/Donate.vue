<template>
  <div>
    <div>
      Rozwój kalkulatora to setki godzin pracy. Jeżeli uważasz aplikację za wartościową, możesz wesprzeć twórcę :-)
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
