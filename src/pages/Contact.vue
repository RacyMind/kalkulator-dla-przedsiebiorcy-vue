<template>
  <q-page
    class="q-py-md full-width c-contact"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form class="q-mt-md q-px-md q-pb-md" />
    </div>
    <Footer />
  </q-page>
</template>

<script lang="ts">
import {useStore} from 'vuex'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Form from 'components/contact/Form.vue'
import Footer from 'components/Footer.vue'

export default {
  setup() {
    const store = useStore()
    store.commit('app/SET_MODULE_TITLE', 'Formularz kontaktowy')
  },
  components: {
    SectionHeader,
    Form,
    Footer,
  },
}
</script>
