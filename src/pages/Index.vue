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

<script>
import Menu from 'components/Menu'
import Footer from 'components/Footer'
export default {
  components: {
    Menu,
    Footer,
  },
}
</script>
