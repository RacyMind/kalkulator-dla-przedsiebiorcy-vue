<template>
  <div class="advert-wrapper q-mt-md">
    <q-card flat class="advert-card text-center q-pa-md">
      <q-icon
        :name="mdiHeart"
        size="24px"
        color="red"
        class="q-mb-xs advert-heart"
      />
      <TaxDonation v-if="isTaxDonationTimeFrame() && Math.random() < 0.5" />
      <Donate v-else />
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { mdiHeart } from '@quasar/extras/mdi-v7'
import Donate from 'components/partials/adrverts/Donate.vue'
import TaxDonation from 'components/partials/adrverts/TaxDonation.vue'

const isTaxDonationTimeFrame = () => {
  const month = new Date().getMonth()
  return month > 0 && month < 5
}
</script>
