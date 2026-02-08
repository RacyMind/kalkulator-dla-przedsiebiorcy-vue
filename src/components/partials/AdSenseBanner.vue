<template>
  <div v-if="showAd" class="adsense-wrapper q-mt-md">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="publisherId"
      :data-ad-slot="adSlot"
      data-ad-format="fluid"
      :data-ad-layout-key="layoutKey"
    ></ins>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { adSenseService } from 'src/services/adsense/AdSenseService';
import { AD_SENSE_CONFIG } from 'src/services/adsense/adSenseConfig';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface Props {
  adSlot: string;
}

defineProps<Props>();

const route = useRoute();
const publisherId = AD_SENSE_CONFIG.publisherId;
const layoutKey = AD_SENSE_CONFIG.layoutKey;
const showAd = ref(false);

onMounted(async () => {
  const canShow =
    adSenseService.isAvailable() && adSenseService.isPageWithAds(route.path);
  if (!canShow) return;

  showAd.value = true;
  await adSenseService.loadScript();
  await nextTick();

  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    showAd.value = false;
  }
});
</script>

<style lang="scss" scoped>
.adsense-wrapper {
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--color-surface-variant);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.06);

  :global(.body--dark) & {
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.2);
  }
}
</style>
