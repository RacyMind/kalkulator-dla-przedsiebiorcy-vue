<template>
  <component
    :is="headingTag"
    class="sectionHeader bg-brand q-py-xs q-px-md text-subtitle1 items-center q-my-none"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  level?: 2 | 3
}

const props = withDefaults(defineProps<Props>(), {
  level: 2,
})

const headingTag = computed(() => `h${props.level}`)
</script>
