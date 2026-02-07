<template>
  <q-page-sticky position="bottom-right"
                 :offset="[18, 18]">
    <transition name="fade-scale">
      <q-btn
        v-show="visible"
        fab
        icon="mdi-chevron-up"
        color="primary"
        aria-label="Powrót na górę"
        @click="scrollToTop"
      >
        <q-tooltip>Powrót na górę</q-tooltip>
      </q-btn>
    </transition>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const SCROLL_THRESHOLD = 300

const onScroll = () => {
  visible.value = window.scrollY > SCROLL_THRESHOLD
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
