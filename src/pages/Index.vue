<template>
  <q-page class="flex flex-center">
    <div>
      <div class="row justify-center items-center q-px-md">
        <div class="flex">
          <img
            alt="Kalkulator finansowy"
            src="~assets/app-icon.svg"
            class="q-mx-auto q-mb-md block"
            style="width:100px;height:auto;"
          >
        </div>
        <div class="flex text-primary text-h5 q-ml-md">
          Kalkulator finansowy
        </div>
      </div>
      <div class="column">
        <Menu />
        <Footer />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Footer from 'components/partials/Footer.vue'
import Menu from 'components/partials/menu/Menu.vue'
export default defineComponent({
  components: {
    Footer,
    Menu,
  },

})
</script>
