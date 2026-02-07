<template>
  <q-page class="q-pa-md">
    <div
      class="row q-col-gutter-md"
      style="max-width: 1200px; margin: 0 auto;"
    >
      <div :class="formColumnClass">
        <q-card flat
                bordered
                class="bg-surface"
                style="border-radius: var(--radius-md)">
          <q-card-section>
            <slot name="form"></slot>
          </q-card-section>
        </q-card>
      </div>
      <div :class="resultsColumnClass">
        <q-card flat
                bordered
                class="bg-surface"
                style="border-radius: var(--radius-md)">
          <q-card-section>
            <slot name="results"></slot>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div style="max-width: 1200px; margin: 0 auto;">
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

const formColumnClass = computed(() =>
  props.singleColumn ? 'col-12' : 'col-12 col-lg-5',
)

const resultsColumnClass = computed(() =>
  props.singleColumn ? 'col-12' : 'col-12 col-lg-7',
)
</script>
