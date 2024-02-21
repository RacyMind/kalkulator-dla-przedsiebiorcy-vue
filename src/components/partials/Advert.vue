<template>
  <div class="text-center bg-teal-1 q-py-md q-px-sm">
    <TaxDonation v-if="isTaxDonationTimeFrame() && Math.random() < 0.5" />
    <Donate v-else />
  </div>
</template>
<script lang="ts" setup>
import Donate from 'components/partials/adrverts/Donate.vue'
import TaxDonation from 'components/partials/adrverts/TaxDonation.vue'

const isTaxDonationTimeFrame = () => {
  const month = new Date().getMonth()
  return month > 0 && month < 5
}
</script>
