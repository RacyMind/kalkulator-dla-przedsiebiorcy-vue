<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      v-if="breadcrumbStore.items.length"
      class="bg-primary-brand"
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
              {{ constants.app.name }}
            </div>
          </div>
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          :icon="themeIcon"
          :aria-label="themeTooltip"
          @click="cycleTheme"
        >
          <q-tooltip>{{ themeTooltip }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-surface-variant"
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
      class="flex flex-center bg-surface-variant"
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
import {useTheme} from 'src/composables/useTheme'

const constants = useConstantsStore()
const {themeIcon, themeTooltip, cycleTheme} = useTheme()

const breadcrumbStore = useBreadcrumbStore()
const leftDrawerOpen = ref(false)
const openModal = ref(false)
</script>
