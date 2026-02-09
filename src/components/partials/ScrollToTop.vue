<template>
  <q-page-sticky v-if="!isNative" position="bottom-right" :offset="[18, 18]">
    <transition name="fade-scale">
      <q-btn
        v-show="visible"
        fab
        :icon="mdiChevronUp"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { mdiChevronUp } from '@quasar/extras/mdi-v7';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const visible = ref(false);
const SCROLL_THRESHOLD = 300;

const onScroll = () => {
  visible.value = window.scrollY > SCROLL_THRESHOLD;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>
