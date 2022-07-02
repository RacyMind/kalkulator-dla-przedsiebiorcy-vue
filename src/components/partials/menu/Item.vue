<template>
  <q-item
    clickable
    exact
    :tag="isExternalLink ? 'a' : 'div'"
    :href="isExternalLink ? link: ''"
    :to="!isExternalLink ? link : ''"
    :class="className"
    class="q-pa-none"
    style="border-bottom: 1px solid white"
  >
    <q-item-section
      style="max-width:25px"
    >
      <div
        class="s-bg bg-module"></div>
    </q-item-section>

    <q-item-section class="q-py-sm q-pr-sm">
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import {computed, toRefs} from 'vue'

export default {
  props: {
    caption: {
      default: '',
      type: String,
    },

    className: {
      default: '',
      type: String,
    },

    link: {
      default: '',
      type: String,
    },

    title: {
      required: true,
      type: String,
    },
  },
  setup(props: any) {
    const {link} = toRefs(props)

    const isExternalLink = computed(() => link.value.includes('https://'))

    return {
      isExternalLink,
    }
  },
}
</script>
<style lang="scss">
.s-bg {
  width: 100%;
  height: 100%;
  display: inline-block;
}
</style>
