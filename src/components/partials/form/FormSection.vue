<template>
  <div class="q-py-md">
    <div class="q-px-md">
      <div class="row">
        <div class="col">
          <div class="text-subtitle2 text-teal-4">{{ props.title }}</div>
        </div>
        <div class="col-shrink">
          <q-btn
            size="sm"
            flat
            rounded
            padding="xs"
            color="teal-4"
            @click="visible = !visible">
            <q-icon
              v-if="visible"
              color="teal-4"
              name="expand_less"/>
            <q-icon
              v-else
              color="teal-4"
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
