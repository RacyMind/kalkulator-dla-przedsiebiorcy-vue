<template>
  <div>
    <SectionHeader
      ref="summary"
      class="bg-primary">
      Minimalna pensja
    </SectionHeader>
    <div>
      <ListRow>
        <template #name>
          styczeń - czerwiec
        </template>
        <template #value>
          {{ pln(wageStats.minimumWage(settingStore.dateOfLawRules.getFullYear(), 0))}}
        </template>
      </ListRow>
      <ListRow>
        <template #name>
          lipiec - grudzień
        </template>
        <template #value>
          {{ pln(wageStats.minimumWage(settingStore.dateOfLawRules.getFullYear(), 6))}}
        </template>
      </ListRow>
    </div>
    <SectionHeader
      ref="summary"
      class="bg-primary">
      Minimalna stawka za godzinę
    </SectionHeader>
    <div>
      <ListRow>
        <template #name>
          styczeń - czerwiec
        </template>
        <template #value>
          {{ pln(wageStats.minimumHourlyWage(settingStore.dateOfLawRules.getFullYear(), 0))}}
        </template>
      </ListRow>
      <ListRow>
        <template #name>
          lipiec - grudzień
        </template>
        <template #value>
          {{ pln(wageStats.minimumHourlyWage(settingStore.dateOfLawRules.getFullYear(), 6))}}
        </template>
      </ListRow>
    </div>
  </div>
</template>

<script setup lang="ts">

import {pln} from 'src/composables/currencyFormat'
import {storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import {useSettingStore} from 'stores/settingStore'
import ListRow from 'components/partials/resultList/ListRow.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'

const {wageStats} = storeToRefs(useConstantsStore())
const settingStore = useSettingStore()
</script>
