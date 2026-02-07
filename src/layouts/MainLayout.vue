<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      v-if="breadcrumbStore.items.length"
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
            <div>
              <q-breadcrumbs
                active-color="white"
                gutter="xs"
                class="text-subtitle1">
                <template v-slot:separator>
                  <q-icon
                    name="chevron_right"
                  />
                </template>
                <q-breadcrumbs-el
                  icon="home"
                  to="/" />
                <q-breadcrumbs-el
                  v-for="item in breadcrumbStore.items"
                  :key="item.name"
                  :label="item.name"
                  :to="item.to"
                  class="c-breadcrumbs__element"
                />
              </q-breadcrumbs>
            </div>
            <div class="xs-hide text-subtitle1">
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
        'q-pt-lg': !breadcrumbStore.items.length
      }"
    >
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Menu from 'components/partials/menu/Menu.vue'
import SupportProject from 'components/partials/SupportProject.vue'
import {useConstantsStore} from 'stores/constantsStore'
const constants = useConstantsStore()

const breadcrumbStore = useBreadcrumbStore()
const leftDrawerOpen = ref(false)
const openModal = ref(false)
</script>
