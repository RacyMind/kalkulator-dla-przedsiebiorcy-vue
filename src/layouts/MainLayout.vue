<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      v-if="moduleTitle"
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
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <Menu :hide-search-input="false" />
        <div class="text-center">
          <q-btn
            class="q-my-md"
            color="teal-7"
            @click="openModal = true">
            <q-icon
              name="o_favorite_border"
              class="q-mr-sm"/>
            Wesprzyj projekt
          </q-btn>
        </div>

        <q-dialog v-model="openModal">
          <SupportProject/>
        </q-dialog>
      </q-list>
    </q-drawer>

    <q-page-container
      class="flex flex-center bg-teal-1"
      :class="{
        'q-pt-lg': !moduleTitle
      }"
    >
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import SupportProject from 'components/SupportProject'
import Menu from 'components/partials/menu/Menu'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      openModal: false,
      leftDrawerOpen: false,
    }
  },
  computed: {
    ...mapGetters({
      moduleTitle: 'app/moduleTitle',
    }),
  },
  components: {
    SupportProject,
    Menu,
  },
}
</script>
