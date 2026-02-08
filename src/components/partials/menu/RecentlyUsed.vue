<template>
  <q-expansion-item
    v-if="recentModules.length"
    :icon="mdiHistory"
    label="Ostatnio używane"
    default-opened
    header-class="text-weight-bold"
  >
    <q-item
      v-for="module in recentModules"
      :key="module.path"
      clickable
      :to="module.path"
      class="menu-item"
      active-class="menu-item--active"
    >
      <q-item-section>
        <q-item-label>{{ module.name }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { useRecentlyUsed } from 'src/composables/useRecentlyUsed'
import {mdiHistory} from '@quasar/extras/mdi-v7'

const { recentModules } = useRecentlyUsed()
</script>
