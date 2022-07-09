<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      v-if="appStore.moduleTitle"
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
            <div v-if="appStore.moduleTitle">
              {{ appStore.moduleTitle }}
            </div>
            <div class="xs-hide">
              {{ constants.APP.NAME }}
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
        'q-pt-lg': !appStore.moduleTitle
      }"
    >
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useAppStore} from 'stores/app-store'
import Menu from 'components/partials/menu/Menu.vue'
import SupportProject from 'components/partials/SupportProject.vue'
import constants from 'src/logic/constants'


export default defineComponent({
  components: {
    Menu,
    SupportProject,
  },
  setup() {
    const appStore = useAppStore()
    const leftDrawerOpen = ref(false)
    const openModal = ref(false)

    return {
      appStore,
      constants,
      leftDrawerOpen,
      openModal,
    }
  },
})
</script>
