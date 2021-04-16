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
          <div class="row justify-between">
            <div v-if="moduleTitle">
              {{ moduleTitle }}
            </div>
            <div class="xs-hide">
              Kalkulator dla przedsiębiorcy
            </div>
          </div>
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
          Narzędzia
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
import { mapGetters } from 'vuex'

const linksData = [
  {
    title: 'Umowa o pracę',
    caption: 'Moduł oblicza składowe wynagrodzenia przy umowie o pracę',
    icon: '',
    link: '/umowa-o-prace',
  },
  {
    title: 'Umowa zlecenie',
    caption: 'Moduł oblicza składowe wynagrodzenia przy umowie zlecenie',
    icon: '',
    link: '/umowa-zlecenie',
  },
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
  data () {
    return {
      leftDrawerOpen: true,
      essentialLinks: linksData,
    }
  },
  computed: {
    ...mapGetters({
      moduleTitle: 'app/moduleTitle',
    }),
  },
  components: { EssentialLink },
}
</script>
