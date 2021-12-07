<template>
  <q-page
    class="q-py-md full-width c-changeLogs"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="list" />
        Historia zmian
      </SectionHeader>
      <Advert />
      <div
        v-for="log in logs"
        :key="log.version">
        <ChangeLog
          :log="log"
        />
        <q-separator v-if="log !== logs[logs.length - 1]" />
      </div>

      <div class="text-center">
        <q-btn
          v-if="!showAll"
          v-model="showAll"
          class="q-mb-md"
          color="brand"
          size="md"
          label="Pokaż wszystko"
          @click="showAll = true"
        />
      </div>
    </div>
    <Footer />
  </q-page>
</template>

<script>
import logs from 'components/changeLogs/logs'
import SectionHeader from 'components/partials/SectionHeader'
import ChangeLog from 'components/changeLogs/ChangeLog'
import Advert from 'components/Advert'
import Footer from 'components/Footer'

export default {
  data () {
    return {
      showAll: false,
    }
  },
  created () {
    this.$store.commit('app/SET_MODULE_TITLE', 'Historia zmian')
  },
  computed: {
    logs () {
      if (!this.showAll) {
        return logs.LOGS.slice(0, 5)
      }
      return logs.LOGS
    },
  },
  components: {
    SectionHeader,
    ChangeLog,
    Advert,
    Footer,
  },
}
</script>
