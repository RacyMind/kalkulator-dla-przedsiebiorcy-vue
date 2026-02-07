<template>
  <div
    v-if="!isNativePlatform"
    class="text-center bg-surface-variant q-py-md q-px-sm">
    <TaxDonation v-if="isTaxDonationTimeFrame() && Math.random() < 0.5" />
    <Donate v-else />
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import Donate from 'components/partials/adrverts/Donate.vue'
import TaxDonation from 'components/partials/adrverts/TaxDonation.vue'

const isNativePlatform = ref(false)

onMounted(async () => {
  try {
    const { Capacitor } = await import('@capacitor/core')
    isNativePlatform.value = Capacitor.isNativePlatform()
  } catch {
    isNativePlatform.value = false
  }
})

const isTaxDonationTimeFrame = () => {
  const month = new Date().getMonth()
  return month > 0 && month < 5
}
</script>
