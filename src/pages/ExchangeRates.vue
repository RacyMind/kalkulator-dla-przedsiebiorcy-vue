<template>
  <q-page
    class="q-py-md full-width c-exchangeRates"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_euro"/>
        Kursy walut
      </SectionHeader>
      <Table/>
      <Advert/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {useAppStore} from 'stores/app-store'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Table from 'components/exchangeRates/Table.vue'

const appStore = useAppStore()
appStore.moduleTitle = 'Kursy walut'
</script>
