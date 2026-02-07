<template>
  <div class="q-py-sm">
    <div class="row">
      <div class="col">
        <h3 class="sectionHeader text-brand q-my-none">{{ props.title }}</h3>
      </div>
      <div class="col-shrink">
        <q-btn
          size="sm"
          flat
          rounded
          padding="xs"
          color="primary"
          :aria-expanded="visible"
          :aria-label="'Przełącz sekcję: ' + props.title"
          @click="visible = !visible">
          <q-icon
            v-if="visible"
            color="primary"
            name="expand_less"/>
          <q-icon
            v-else
            color="primary"
            name="expand_more"/>
        </q-btn>
      </div>
    </div>
    <q-slide-transition>
      <div v-show="visible">
        <slot></slot>
      </div>
    </q-slide-transition>
  </div>
  <Separator v-if="!hideSeparator" />
</template>
<script setup lang="ts">
import {ref} from 'vue'
import Separator from 'components/partials/Separator.vue'

const props = defineProps({
  title: String,
  hideSeparator: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const visible = ref(true)
</script>
