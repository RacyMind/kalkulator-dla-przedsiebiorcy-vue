<template>
  <q-page
    class="q-py-md full-width"
    style="max-width:800px;"
  >
    <div class="full-width bg-surface">
      <slot></slot>
    </div>
    <Footer/>
  </q-page>
</template>
<script setup lang="ts">
import Footer from 'components/partials/Footer.vue'
</script>
