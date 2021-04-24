<template>
  <q-page
    class="q-pa-md full-width c-changeLogs"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="list" />
        Historia zmian
      </SectionHeader>
      <Advert />
      <ChangeLog
        v-for="log in logs"
        :key="log.version"
        :log="log"
      />
    </div>
    <Footer />
  </q-page>
</template>

<script>
import logs from 'components/changeLogs/logs'
import SectionHeader from 'components/SectionHeader'
import ChangeLog from 'components/changeLogs/ChangeLog'
import Advert from 'components/Advert'
import Footer from 'components/Footer'

export default {
  data () {
    return {
      logs: [],
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Historia zmian')
    this.logs = logs.LOGS
  },
  components: {
    SectionHeader,
    ChangeLog,
    Advert,
    Footer,
  },
}
</script>
