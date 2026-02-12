<template>
  <div v-if="showAd" class="adsense-wrapper q-mt-md">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="publisherId"
      :data-ad-slot="normalizedAdSlot"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { adSenseService } from 'src/services/adsense/AdSenseService'
import { AD_SENSE_CONFIG } from 'src/services/adsense/adSenseConfig'

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>
  }
}

interface Props {
  adSlot: string
}

const props = defineProps<Props>()

const route = useRoute()
const publisherId = AD_SENSE_CONFIG.publisherId
const showAd = ref(false)
const normalizedAdSlot = ref('')

onMounted(async () => {
  const canShow =
    adSenseService.isAvailable() && adSenseService.isPageWithAds(route.path)
  if (!canShow) return

  const adSlot = props.adSlot.trim()
  if (adSlot.length === 0) return

  normalizedAdSlot.value = adSlot

  showAd.value = true

  await adSenseService.loadScript()
  await nextTick()

  try {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  } catch {
    showAd.value = false
  }
})
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
