<template>
  <div class="text-teal-7 q-py-md text-center">
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
      <div style="font-size: 12px;">
        &copy; 2011-{{year}} Kalkulator finansowy<br>
        by <a
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

<script>
import SupportProject from 'components/SupportProject'
export default {
  data () {
    return {
      year: new Date().getFullYear(),
      openModal: false,
    }
  },
  components: {
    SupportProject,
  },
}
</script>
