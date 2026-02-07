<template>
  <div>
    <q-input
      v-if="!hideSearchInput"
      v-model="typedText"
      class="q-mt-md q-mx-sm"
      type="text"
      label="Szukaj..."
      color="brand"
      clearable
      outlined
      dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <RecentlyUsed />

    <template v-for="section in sections"
              :key="section.key">
      <q-expansion-item
        v-if="visibleMenuItems[section.key]?.length"
        :icon="section.icon"
        :label="section.label"
        :default-opened="isSectionActive(section.key)"
        header-class="text-weight-bold"
      >
        <Item
          v-for="link in visibleMenuItems[section.key]"
          :key="link.title"
          v-bind="link"
        />
      </q-expansion-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import {MenuItem} from 'components/partials/menu/interfaces/MenuItem'
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'
import Item from './Item.vue'
import RecentlyUsed from './RecentlyUsed.vue'
import menuItems from 'components/partials/menu/menuItems'

interface Props {
  hideSearchInput?: boolean
}

withDefaults(defineProps<Props>(), {
  hideSearchInput: true,
})

const route = useRoute()

const sections = [
  { key: 'company', label: 'Firma', icon: 'mdi-domain' },
  { key: 'taxes', label: 'Podatki i rozliczenia', icon: 'mdi-cash-multiple' },
  { key: 'work', label: 'Praca', icon: 'mdi-briefcase' },
  { key: 'savings', label: 'Oszczędzanie', icon: 'mdi-piggy-bank' },
  { key: 'currencies', label: 'Waluty', icon: 'mdi-currency-usd' },
  { key: 'info', label: 'Informacje', icon: 'mdi-information' },
  { key: 'app', label: 'Aplikacja', icon: 'mdi-application' },
]

const isSectionActive = (sectionKey: string): boolean => {
  const items = (menuItems as Record<string, MenuItem[]>)[sectionKey] || []
  return items.some((item: MenuItem) => route.path === item.link || route.path.startsWith(item.link + '/'))
}

const typedText = ref('')

const searchInLinks = (search:string, menuItems:MenuItem[]):MenuItem[] => {
  search = search.toLowerCase().trim()

  return menuItems.filter((menuItem:MenuItem):boolean=> {
    return menuItem.title.toLowerCase().search(search) != -1 || menuItem.caption.toLowerCase().search(search) != -1
  })
}

const visibleMenuItems = computed( () => {
  if(!typedText.value) {
    return menuItems
  }

  let menuItemsWithTypedText = {} as any

  for (const [section, sectionItems] of Object.entries(menuItems)) {
    menuItemsWithTypedText[section] = searchInLinks(typedText.value, sectionItems) as MenuItem[]
  }

  return menuItemsWithTypedText
})
</script>
