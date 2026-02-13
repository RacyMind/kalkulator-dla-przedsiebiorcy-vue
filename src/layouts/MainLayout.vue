<template>
  <q-layout view="lHh Lpr lFf">
    <a href="#main-content" class="skip-to-content">Przejdź do treści</a>
    <q-header class="bg-primary-brand" elevated>
      <q-toolbar>
        <q-btn
          v-if="!isDesktop"
          ref="hamburgerRef"
          flat
          dense
          round
          :icon="matMenu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <div class="row justify-between items-center">
            <div class="row items-center">
              <router-link
                to="/"
                class="text-white text-no-decoration row items-center"
                :aria-label="constants.app.name + ' — strona główna'"
              >
                <img
                  src="~assets/app-icon-white.svg"
                  alt=""
                  style="width: 28px; height: 28px"
                  class="q-mr-sm"
                />
                <span class="gt-xs">{{ constants.app.name }}</span>
              </router-link>

              <template v-if="breadcrumbStore.items.length">
                <q-icon :name="matChevronRight" class="q-mx-xs gt-xs" />
                <q-breadcrumbs
                  active-color="white"
                  gutter="xs"
                  class="text-subtitle1 header-breadcrumbs"
                >
                  <template v-slot:separator>
                    <q-icon :name="matChevronRight" />
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
      aria-label="Panel boczny"
      @update:model-value="(val) => (leftDrawerOpen = val)"
    >
      <q-scroll-area class="fit">
        <nav aria-label="Menu główne">
          <q-list>
            <Menu :hide-search-input="false" />
          </q-list>
        </nav>

        <footer
          class="text-center q-py-md"
          style="border-top: 1px solid rgba(0, 0, 0, 0.12)"
        >
          <PremiumActions class="q-mb-sm" />
          <q-btn
            v-if="!premiumStore.isPremiumActive"
            class="q-mb-sm"
            color="red-7"
            rounded
            unelevated
            aria-label="Wesprzyj twórcę"
            @click="openModal = true"
          >
            <q-icon :name="outlinedFavorite" class="q-mr-sm" />
            Wesprzyj twórcę
          </q-btn>
          <div class="text-caption text-grey q-mt-xs">
            v{{ constants.app.version }}
          </div>
        </footer>
      </q-scroll-area>

      <q-dialog v-if="!premiumStore.isPremiumActive" v-model="openModal">
        <SupportProject />
      </q-dialog>
    </q-drawer>

    <q-page-container class="bg-surface-variant">
      <main id="main-content" tabindex="-1">
        <h1 class="sr-only">
          {{
            breadcrumbStore.items.length
              ? breadcrumbStore.items[breadcrumbStore.items.length - 1].name
              : constants.app.name
          }}
        </h1>
        <router-view v-slot="{ Component }">
          <transition name="fade-scale" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <ScrollToTop />
      </main>
    </q-page-container>
    <ConsentBanner />
  </q-layout>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import Menu from 'components/partials/menu/Menu.vue'
import SupportProject from 'components/partials/SupportProject.vue'
import PremiumActions from 'components/partials/PremiumActions.vue'
import ScrollToTop from 'components/partials/ScrollToTop.vue'
import ConsentBanner from 'components/partials/ConsentBanner.vue'
import { useConstantsStore } from 'stores/constantsStore'
import { usePremiumStore } from 'stores/premiumStore'
import { useTheme } from 'src/composables/useTheme'
import { useRecentlyUsed } from 'src/composables/useRecentlyUsed'
import { matMenu, matChevronRight, outlinedFavorite } from 'src/icons'

const $q = useQuasar()
const route = useRoute()
const constants = useConstantsStore()
const premiumStore = usePremiumStore()
const { themeIcon, themeTooltip, cycleTheme } = useTheme()
const { addRecent } = useRecentlyUsed()

const breadcrumbStore = useBreadcrumbStore()
const leftDrawerOpen = ref(false)
const openModal = ref(false)
const hamburgerRef = ref<InstanceType<typeof import('quasar').QBtn> | null>(
  null,
)

const isDesktop = computed(() => $q.screen.gt.md)

watch(
  () => route.path,
  () => {
    if (!isDesktop.value) {
      leftDrawerOpen.value = false
    }
  },
)

watch(leftDrawerOpen, (newVal, oldVal) => {
  if (!newVal && oldVal && !isDesktop.value) {
    hamburgerRef.value?.$el?.focus()
  }
})

watch(
  () => breadcrumbStore.items,
  (items) => {
    if (route.path !== '/' && items.length) {
      const lastBreadcrumb = items[items.length - 1]
      addRecent(route.path, lastBreadcrumb.name)
    }
  },
  { deep: true },
)
</script>
