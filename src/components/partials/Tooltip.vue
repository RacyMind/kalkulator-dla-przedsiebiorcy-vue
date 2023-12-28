<template>
  <q-btn
    flat
    round
    size="sm"
    padding="none"
    :color="props.color"
    icon="help">
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      :offset="[0, 10]">
      <slot />
    </q-tooltip>
  </q-btn>
</template>

<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    reqired: false,
    default: 'primary',
  },
})
</script>
