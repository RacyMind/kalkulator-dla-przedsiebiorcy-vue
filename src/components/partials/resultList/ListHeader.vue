<template>
  <div class="s-row row justify-between q-px-md q-py-sm bg-brand text-white">
    {{ props.title }}
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: String,
})
</script>
