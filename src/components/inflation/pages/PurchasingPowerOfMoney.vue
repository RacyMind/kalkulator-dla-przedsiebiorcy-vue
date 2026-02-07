<template>
  <ModulePageLayout class="c-info"
                    single-column>
    <template #form>
      <SectionHeader :level="2">
        <q-icon name="o_insights"/>
        Wykres
      </SectionHeader>
      <Advert/>
      <PurchasingPowerOfMoneyStatistics/>
    </template>
    <template #results>
    </template>
  </ModulePageLayout>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import PurchasingPowerOfMoneyStatistics from 'components/inflation/PurchasingPowerOfMoneyStatistics.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Siła nabywcza pieniądza',
  },
]
</script>
