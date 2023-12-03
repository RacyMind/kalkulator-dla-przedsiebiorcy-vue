<template>
  <q-select
    v-model="lawRuleDate"
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

const { availableDates, lawRuleDate } = useLawRuleDate()
</script>
