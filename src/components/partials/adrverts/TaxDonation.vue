<template>
  <div>
    <div>
      Wesprzyj twórcę aplikacji i przekaż 1,5% podatku<br>
      KRS: 0000270809<br>
      Cel szczególny: Socha, 15548
    </div>
    <q-btn
      label="Więcej informacji"
      no-caps
      class="q-mt-sm"
      style="width: 75%;max-width:180px"
      color="primary"
      outline
      @click="openModal = true"
    />
    <q-dialog v-model="openModal">
      <SupportAuthor />
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import SupportAuthor from 'components/partials/SupportAuthor.vue'

const openModal = ref(false)
</script>
