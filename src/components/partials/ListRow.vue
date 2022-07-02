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

<script>
export default {
  props: {
    inline: {
      default: true,
      type: Boolean,
    },
    name: {
      required: true,
      type: String,
    },
    nested: {
      default: false,
      type: Boolean,
    },
    value: {
      required: true,
    },
  },
}
</script>
