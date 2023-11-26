<template>
  <div class="q-pt-md">
    <div class="q-px-md">
      <div class="row jusstify-between">
        <div class="col">
          <div class="text-subtitle1 text-teal-4">{{ props.title }}</div>
        </div>
        <div class="col-shrink">
          <q-btn
            size="sm"
            flat
            padding="sm"
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
    <q-separator
      class="q-mt-md"
      color="teal-1" />
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps({
  title: String,
})
const visible = ref(true)
</script>
