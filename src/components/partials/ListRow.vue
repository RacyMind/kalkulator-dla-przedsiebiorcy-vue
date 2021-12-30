<template>
  <div
    v-if="inline"
    class="row justify-between q-px-md q-py-sm">
    <div>
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
    name: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    inline: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
