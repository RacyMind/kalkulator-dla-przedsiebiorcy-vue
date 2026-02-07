<template>
  <q-item
    clickable
    exact
    :tag="isExternalLink ? 'a' : 'div'"
    :href="isExternalLink ? link: undefined"
    :to="!isExternalLink ? link : undefined"
    :class="className"
    class="menu-item"
    active-class="menu-item--active"
  >
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {computed} from 'vue'

interface Props {
  caption?: string
  className?: string
  link?: string
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  caption: '',
  className: '',
  link: '',
})

const isExternalLink = computed(() => props.link.includes('https://'))
</script>
