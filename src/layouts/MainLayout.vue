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
              {{ $constants.APP.NAME }}
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
        <Menu />
      </q-list>
    </q-drawer>

    <q-page-container class="flex flex-center q-mt-md bg-teal-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Menu from 'components/Menu'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      leftDrawerOpen: true,
    }
  },
  computed: {
    ...mapGetters({
      moduleTitle: 'app/moduleTitle',
    }),
  },
  components: { Menu },
}
</script>
