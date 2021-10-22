<template>
  <q-page class="flex flex-center">
    <div>
      <div class="flex flex-center">
        <img
          alt="Kalkulator finansowy"
          src="~assets/app-logo.svg"
          class="q-mx-auto q-mb-md block"
          style="width:100px;height:auto;"
        >
        <div
          class="text-primary q-ml-sm q-r-sm"
          style="font-size:26px;">
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

<script>
import Menu from 'components/Menu'
import Footer from 'components/Footer'
export default {
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', '')
  },
  components: {
    Menu,
    Footer,
  },
}
</script>
