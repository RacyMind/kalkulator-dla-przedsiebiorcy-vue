<template>
  <q-page class="module-page module-page--padded">
    <div
      class="row q-col-gutter-md"
      :style="containerStyle"
    >
      <div :class="formColumnClass">
        <q-card
          flat
          class="module-card module-card--padded"
        >
          <slot name="form"></slot>
        </q-card>
      </div>
      <div v-if="$slots.results"
           :class="resultsColumnClass">
        <q-card
          flat
          class="module-card module-card--padded"
        >
          <slot name="results"></slot>
        </q-card>
      </div>
    </div>
    <div :style="containerStyle">
      <Footer />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Footer from 'components/partials/Footer.vue'

interface Props {
  singleColumn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  singleColumn: false,
})

const containerStyle = computed(() =>
  props.singleColumn
    ? 'max-width: 800px; margin: 0 auto;'
    : 'max-width: 1400px; margin: 0 auto;',
)

const formColumnClass = computed(() =>
  props.singleColumn ? 'col-12' : 'col-12 col-md-6',
)

const resultsColumnClass = computed(() =>
  props.singleColumn ? 'col-12' : 'col-12 col-md-6',
)
</script>
