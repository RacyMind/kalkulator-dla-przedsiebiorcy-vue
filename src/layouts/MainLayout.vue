<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-red-8"
      elevated>
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
          Kalkulator dla przedsiębiorcy
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Moduły
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="flex flex-center q-mt-md bg-teal-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Umowa o dzieło',
    caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o dzieło',
    icon: '',
    link: '/umowa-o-dzielo',
  },
  {
    title: 'Faktura VAT',
    caption: 'Moduł przelicza kwoty z netto na brutto i z brutto na netto',
    icon: '',
    link: '/faktura-vat',
  },
  {
    title: 'Odsetki',
    caption: 'Moduł oblicza odsetki za każdy dzień',
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
