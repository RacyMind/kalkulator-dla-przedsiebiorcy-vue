<template>
  <q-item
    :class="[
      { 'q-pl-lg': nested },
      highlighted ? 'bg-primary-brand text-on-surface' : '',
    ]"
    dense
  >
    <q-item-section v-if="inline">
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="inline"
                    side
                    style="color: inherit">
      <q-item-label>{{ value }}</q-item-label>
    </q-item-section>

    <q-item-section v-if="!inline">
      <q-item-label class="text-bold">{{ name }}</q-item-label>
      <q-item-label>{{ value }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  inline?: boolean
  name: string
  nested?: boolean
  value: string | number
  highlighted?: boolean
}

withDefaults(defineProps<Props>(), {
  inline: true,
  nested: false,
  highlighted: false,
})
</script>
