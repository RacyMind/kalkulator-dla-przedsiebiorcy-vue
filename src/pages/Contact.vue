<template>
  <q-page
    class="q-pa-md full-width c-contact"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-px-md q-pb-md"
      />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import logs from 'components/changeLogs/logs'
import SectionHeader from 'components/SectionHeader'
import Form from 'components/contact/Form'
import Footer from 'components/Footer'

export default {
  data () {
    return {
      logs: [],
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Formularz kontaktowy')
    this.logs = logs.LOGS
  },
  components: {
    SectionHeader,
    Form,
    Footer,
  },
}
</script>
