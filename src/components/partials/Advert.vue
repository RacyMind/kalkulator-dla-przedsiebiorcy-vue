<template>
  <div class="text-center bg-teal-1 q-py-md">
    <TaxDonation v-if="isTaxDonationTimeFrame() && Math.random() < 0.5" />
    <Donate v-else />
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import Donate from 'components/partials/adrverts/Donate.vue'
import SupportAuthor from 'components/partials/SupportAuthor.vue'
import TaxDonation from 'components/partials/adrverts/TaxDonation.vue'

const openModal = ref(false)

const isTaxDonationTimeFrame = () => {
  const nmonth = new Date().getMonth()
  return nmonth > 1 && nmonth < 5
}
</script>
