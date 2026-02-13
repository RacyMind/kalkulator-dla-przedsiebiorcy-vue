<template>
  <q-page class="module-page module-page--padded">
    <div class="row q-col-gutter-md" :style="containerStyle">
      <div :class="formColumnClass">
        <q-card flat class="module-card module-card--padded">
          <slot name="form"></slot>
        </q-card>
      </div>
      <div v-if="$slots.results" :class="resultsColumnClass" aria-live="polite">
        <q-card flat class="module-card module-card--padded">
          <slot name="results"></slot>
        </q-card>
        <AdSenseBanner v-if="showAdSenseBanner" :ad-slot="adSlot" />
      </div>
    </div>
    <div :style="containerStyle">
      <Footer />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AdSenseBanner from 'components/partials/AdSenseBanner.vue'
import Footer from 'components/partials/Footer.vue'
import { AD_SENSE_CONFIG } from 'src/services/adsense/adSenseConfig'
import { usePremiumStore } from 'stores/premiumStore'

const adSlot = AD_SENSE_CONFIG.adSlot
const premiumStore = usePremiumStore()

interface Props {
  singleColumn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  singleColumn: false,
})

const containerStyle = computed(() =>
  props.singleColumn
    ? 'max-width: 800px; margin: 0 auto;'
    : 'max-width: 1400px; margin: 0 auto;',
)

const formColumnClass = computed(() =>
  props.singleColumn ? 'col-12' : 'col-12 col-md-6',
)

const resultsColumnClass = computed(() =>
  props.singleColumn ? 'col-12' : 'col-12 col-md-6',
)

const showAdSenseBanner = computed(() => !premiumStore.isPremiumActive)
</script>
