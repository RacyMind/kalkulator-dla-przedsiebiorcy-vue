<template>
  <div
    role="listitem"
    class="s-row q-px-md q-py-sm"
    :class="{
      'row justify-between items-center': !$slots.description,
      'bg-primary text-white -highlighted': props.highlight,
      'q-pl-lg': props.nested,
    }"
  >
    <div class="col">
      <slot name="name"></slot>
    </div>
    <div v-if="$slots.value" class="col-shrink">
      <slot name="value"></slot>
    </div>
    <div v-if="$slots.description" class="footer-text text-body2 q-mt-xs">
      <slot name="description"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  highlight: {
    type: Boolean,
    required: false,
    default: false,
  },
  nested: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.s-row:not(.-highlighted):nth-child(odd) {
  background-color: var(--color-surface-variant);
}
</style>
