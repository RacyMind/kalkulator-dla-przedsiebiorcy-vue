<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="flex flex-center bg-teal-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Faktura VAT',
    caption: 'Przeliczanie kwoty z netto na brutto i z brutto na netto',
    icon: '',
    link: '/faktura-vat',
  },
  {
    title: 'Odsetki',
    caption: 'Oblicza odsetki za każdy dzień',
    icon: '',
    link: '/odsetki',
  },
]

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: true,
      essentialLinks: linksData,
    }
  },
  components: { EssentialLink },
}
</script>
