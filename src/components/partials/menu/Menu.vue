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
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <template v-if="visibleMenuItems.business.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Firma
      </h6>
      <Item
        v-for="link in visibleMenuItems.business"
        :key="link.title"
        v-bind="link"
      />
    </template>
    <template v-if="visibleMenuItems.work.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Praca
      </h6>
      <Item
        v-for="link in visibleMenuItems.work"
        :key="link.title"
        v-bind="link"
      />
    </template>
    <template v-if="visibleMenuItems.informator.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Informator
      </h6>
      <Item
        v-for="link in visibleMenuItems.informator"
        :key="link.title"
        v-bind="link"
      />
    </template>

    <template v-if="visibleMenuItems.percentage.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Oprocentowanie
      </h6>
      <Item
        v-for="link in visibleMenuItems.percentage"
        :key="link.title"
        v-bind="link"
      />
    </template>

    <template v-if="visibleMenuItems.currencies.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Waluty
      </h6>
      <Item
        v-for="link in visibleMenuItems.currencies"
        :key="link.title"
        v-bind="link"
      />
    </template>

    <template v-if="visibleMenuItems.app.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Aplikacja
      </h6>
      <Item
        v-for="link in visibleMenuItems.app"
        :key="link.title"
        v-bind="link"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {computed, ref} from 'vue'
import {MenuItem} from 'components/partials/menu/interfaces/MenuItem'
import Item from './Item.vue'
import menuItems from 'components/partials/menu/menuItems'
export default {
  components: {
    Item,
  },
  props: {
    hideSearchInput: {
      default: true,
      required: false,
      type: Boolean,
    },
  },
  setup () {
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

    return {
      typedText,
      visibleMenuItems,
    }
  },
}
</script>
