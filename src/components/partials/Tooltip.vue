<template>
  <q-btn
    flat
    round
    size="sm"
    padding="none"
    :color="props.color"
    icon="help">
    <q-tooltip>
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
