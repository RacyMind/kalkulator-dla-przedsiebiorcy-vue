<template>
  <div class="q-pt-md">
    <div class="row">
      <div class="col">
        <div class="text-subtitle2 text-teal-4 s-text-title">{{ props.title }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: String,
})
</script>

<style lang="scss" scoped>
.s-text-title{
  font-size: 0.75rem;
}
</style>
