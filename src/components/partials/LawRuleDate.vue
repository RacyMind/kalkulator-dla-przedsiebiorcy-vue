<template>
  <q-select
    v-model="store.dateOfLawRules"
    :options="availableDates"
    label="Data obowiązywania przepisów"
    color="brand"
    emit-value
    map-options
    :disable="availableDates.length === 1"
    required
  />
</template>

<script setup lang="ts">
import {useLawRuleDate} from 'src/composables/lawRuleDate'
import {useSettingStore} from 'stores/settingStore'

const { availableDates } = useLawRuleDate()
const store = useSettingStore()
</script>
