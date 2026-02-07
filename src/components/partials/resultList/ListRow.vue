<template>
  <div
    role="listitem"
    class="s-row row justify-between q-px-md q-py-sm items-center"
    :class="{
      'bg-primary text-white -highlighted': props.highlight,
      'q-pl-lg': props.nested
    }">
    <div class="col">
      <slot name="name"></slot>
    </div>
    <div class="col-shrink">
      <slot name="value"></slot>
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
.s-row:not(.-highlighted):nth-child(even){
  background-color: var(--color-surface-variant);
}
</style>
