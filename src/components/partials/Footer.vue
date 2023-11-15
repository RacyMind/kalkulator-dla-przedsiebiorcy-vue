<template>
  <div class="text-teal-7 q-pt-lg q-pb-sm text-center">
    <div>
      <q-btn
        class="q-mb-sm"
        color="teal-7"
        @click="openModal = true">
        <q-icon
          name="o_favorite_border"
          class="q-mr-sm" />
        Wesprzyj projekt
      </q-btn>
      <div style="font-size: 0.75rem;">
        &copy; 2011-{{year}} Kalkulator finansowy<br>
        Wersja {{ constants.APP.VERSION }}<br>
        Stworzone przez <a
          href="https://www.linkedin.com/in/%C5%82ukasz-socha-30083841/"
          class="text-teal-7"
          target="_blank">
          Łukasz Socha
        </a>
      </div>
    </div>

    <q-dialog v-model="openModal">
      <SupportProject />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import SupportProject from 'components/partials/SupportProject.vue'
import constants from 'src/logic/constants'
export default defineComponent({
  components: {
    SupportProject,
  },
  setup() {
    const openModal = ref(false)
    const year = ref(new Date().getFullYear())

    return {
      constants,
      openModal,
      year,
    }
  },
})
</script>
