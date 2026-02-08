<template>
  <q-btn
    flat
    round
    size="sm"
    padding="none"
    :color="props.color"
    :icon="props.icon"
    aria-label="Pomoc">
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      max-width="400px"
      :offset="[0, 10]">
      <slot />
    </q-tooltip>
  </q-btn>
</template>

<script lang="ts" setup>
import {matHelp} from 'src/icons'

const props = defineProps({
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
  icon: {
    type: String,
    required: false,
    default: matHelp,
  },
})
</script>
