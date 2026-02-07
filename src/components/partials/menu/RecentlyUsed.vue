<template>
  <q-expansion-item
    v-if="recentModules.length"
    icon="mdi-history"
    label="Ostatnio używane"
    default-opened
    header-class="text-weight-bold"
  >
    <q-item
      v-for="module in recentModules"
      :key="module.path"
      clickable
      :to="module.path"
      class="q-pl-lg"
    >
      <q-item-section>
        <q-item-label>{{ module.name }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { useRecentlyUsed } from 'src/composables/useRecentlyUsed'

const { recentModules } = useRecentlyUsed()
</script>
