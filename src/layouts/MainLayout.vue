<template>
  <q-layout :view="isDesktop ? 'lHh Lpr lFf' : 'lHh lpr lFf'">
    <q-header
      class="bg-primary-brand"
      elevated
    >
      <q-toolbar>
        <q-btn
          v-if="!isDesktop"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <div class="row justify-between items-center">
            <div class="row items-center">
              <router-link to="/"
                           class="text-white text-no-decoration row items-center">
                <q-icon name="mdi-calculator"
                        size="sm"
                        class="q-mr-sm" />
                <span class="gt-xs">{{ constants.app.name }}</span>
              </router-link>

              <template v-if="breadcrumbStore.items.length">
                <q-icon name="chevron_right"
                        class="q-mx-xs" />
                <q-breadcrumbs
                  active-color="white"
                  gutter="xs"
                  class="text-subtitle1"
                >
                  <template v-slot:separator>
                    <q-icon name="chevron_right" />
                  </template>
                  <q-breadcrumbs-el
                    v-for="item in breadcrumbStore.items"
                    :key="item.name"
                    :label="item.name"
                    :to="item.to"
                    class="c-breadcrumbs__element"
                  />
                </q-breadcrumbs>
              </template>
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
      :model-value="isDesktop || leftDrawerOpen"
      :overlay="!isDesktop"
      :breakpoint="0"
      bordered
      content-class="bg-surface-variant"
      @update:model-value="val => leftDrawerOpen = val"
    >
      <q-scroll-area class="fit">
        <q-list>
          <Menu :hide-search-input="false" />
        </q-list>

        <div class="text-center q-py-md"
             style="border-top: 1px solid rgba(0,0,0,0.12)">
          <q-btn
            class="q-mb-sm"
            color="teal-7"
            rounded
            unelevated
            @click="openModal = true"
          >
            <q-icon name="o_favorite_border"
                    class="q-mr-sm" />
            Wesprzyj projekt
          </q-btn>
          <div class="text-caption text-grey q-mt-xs">
            v{{ constants.app.version }}
          </div>
        </div>
      </q-scroll-area>

      <q-dialog v-model="openModal">
        <SupportProject />
      </q-dialog>
    </q-drawer>

    <q-page-container class="bg-surface-variant">
      <router-view v-slot="{ Component }">
        <transition name="fade-scale"
                    mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <ScrollToTop />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {ref, watch, computed} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Menu from 'components/partials/menu/Menu.vue'
import SupportProject from 'components/partials/SupportProject.vue'
import ScrollToTop from 'components/partials/ScrollToTop.vue'
import {useConstantsStore} from 'stores/constantsStore'
import {useTheme} from 'src/composables/useTheme'
import {useRecentlyUsed} from 'src/composables/useRecentlyUsed'

const $q = useQuasar()
const route = useRoute()
const constants = useConstantsStore()
const {themeIcon, themeTooltip, cycleTheme} = useTheme()
const {addRecent} = useRecentlyUsed()

const breadcrumbStore = useBreadcrumbStore()
const leftDrawerOpen = ref(false)
const openModal = ref(false)

const isDesktop = computed(() => $q.screen.gt.md)

watch(() => route.path, (path) => {
  if (path !== '/' && breadcrumbStore.items.length) {
    const lastBreadcrumb = breadcrumbStore.items[breadcrumbStore.items.length - 1]
    addRecent(path, lastBreadcrumb.name)
  }

  if (!isDesktop.value) {
    leftDrawerOpen.value = false
  }
})
</script>
