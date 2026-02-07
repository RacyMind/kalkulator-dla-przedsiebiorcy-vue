<template>
  <q-page class="q-pa-md">
    <div style="max-width: 1200px; margin: 0 auto;">
      <!-- Hero section -->
      <div class="row items-center justify-center q-mb-xl q-pt-lg">
        <img
          alt="Kalkulator finansowy"
          src="~assets/app-icon.svg"
          style="width: 80px; height: auto;"
          class="q-mr-md"
        >
        <div>
          <div class="text-h4 text-weight-bold"
               style="color: var(--color-primary)">
            Kalkulator finansowy
          </div>
          <div class="text-subtitle1 text-on-surface"
               style="color: var(--color-text-secondary)">
            Kompleksowe narzędzia finansowe dla przedsiębiorców
          </div>
        </div>
      </div>

      <!-- Tile grid — 6 sections -->
      <div
        v-for="section in dashboardSections"
        :key="section.key"
        class="q-mb-lg"
      >
        <div class="text-h6 text-weight-bold q-mb-sm"
             :style="{ color: section.color }">
          <q-icon :name="section.icon"
                  class="q-mr-xs" />
          {{ section.label }}
        </div>

        <div class="row q-col-gutter-md">
          <div
            v-for="item in section.items"
            :key="item.link"
            class="col-12 col-sm-6 col-lg-4"
          >
            <q-card
              flat
              bordered
              clickable
              class="dashboard-tile bg-surface cursor-pointer full-height"
              style="border-radius: var(--radius-md); transition: transform 200ms ease, box-shadow 200ms ease;"
              @click="$router.push(item.link)"
            >
              <q-card-section>
                <div class="text-subtitle1 text-weight-medium">
                  {{ item.title }}
                </div>
                <div
                  v-if="item.caption"
                  class="text-caption"
                  style="color: var(--color-text-secondary)"
                >
                  {{ item.caption }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Footer from 'components/partials/Footer.vue'
import menuItems from 'components/partials/menu/menuItems'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = []

const dashboardSections = [
  { key: 'company', label: 'Firma', icon: 'mdi-domain', color: 'var(--module-business)', items: menuItems.company },
  { key: 'taxes', label: 'Podatki i rozliczenia', icon: 'mdi-cash-multiple', color: 'var(--module-taxes)', items: menuItems.taxes },
  { key: 'work', label: 'Praca', icon: 'mdi-briefcase', color: 'var(--module-work)', items: menuItems.work },
  { key: 'savings', label: 'Oszczędzanie', icon: 'mdi-piggy-bank', color: 'var(--module-percentage)', items: menuItems.savings },
  { key: 'currencies', label: 'Waluty', icon: 'mdi-currency-usd', color: 'var(--module-currencies)', items: menuItems.currencies },
  { key: 'info', label: 'Informacje', icon: 'mdi-information', color: 'var(--module-informator)', items: menuItems.info },
]
</script>

<style lang="scss" scoped>
.dashboard-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
