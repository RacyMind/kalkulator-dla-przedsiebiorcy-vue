<template>
  <div
    v-if="inline"
    class="row justify-between q-px-md q-py-sm">
    <div :class="[{ 'q-pl-sm': nested }]">
      {{ name }}
    </div>
    <div>
      {{ value }}
    </div>
  </div>
  <div
    v-else
    class="q-px-md q-py-sm">
    <div class="text-bold">
      {{ name }}
    </div>
    <div>
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  inline?: boolean
  name: string
  nested?: boolean
  value: string | number
}

withDefaults(defineProps<Props>(), {
  inline: true,
  nested: false,
})
</script>
