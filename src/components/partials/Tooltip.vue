<template>
  <q-btn
    flat
    round
    size="sm"
    padding="none"
    :color="props.color"
    :icon="props.icon">
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
const props = defineProps({
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
  icon: {
    type: String,
    required: false,
    default: 'help',
  },
})
</script>
