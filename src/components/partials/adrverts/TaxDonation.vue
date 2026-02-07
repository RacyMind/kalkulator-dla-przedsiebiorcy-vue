<template>
  <div>
    <div>
      Przekaż 1,5% podatku — to nic nie kosztuje!<br>
      <strong>KRS: 0000270809</strong><br>
      <strong>Cel szczególny: Socha, 15548</strong>
    </div>
    <q-btn
      label="Dowiedz się więcej"
      no-caps
      class="q-mt-sm"
      style="width: 80%; max-width: 220px"
      color="red-7"
      unelevated
      rounded
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
