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
    <template v-if="visibleLinks.business.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Firma
      </h6>
      <MenuLink
        v-for="link in visibleLinks.business"
        :key="link.title"
        v-bind="link"
      />
    </template>
    <template v-if="visibleLinks.work.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Praca
      </h6>
      <MenuLink
        v-for="link in visibleLinks.work"
        :key="link.title"
        v-bind="link"
      />
    </template>
    <template v-if="visibleLinks.informator.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Informator
      </h6>
      <MenuLink
        v-for="link in visibleLinks.informator"
        :key="link.title"
        v-bind="link"
      />
    </template>

    <template v-if="visibleLinks.percentage.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Oprocentowanie
      </h6>
      <MenuLink
        v-for="link in visibleLinks.percentage"
        :key="link.title"
        v-bind="link"
      />
    </template>

    <template v-if="visibleLinks.currencies.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Waluty
      </h6>
      <MenuLink
        v-for="link in visibleLinks.currencies"
        :key="link.title"
        v-bind="link"
      />
    </template>

    <template v-if="visibleLinks.app.length">
      <h6
        class="q-my-md"
        style="margin-left: 32px;"
      >
        Aplikacja
      </h6>
      <MenuLink
        v-for="link in visibleLinks.app"
        :key="link.title"
        v-bind="link"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {computed, ref} from 'vue'
import {MenuItem} from 'components/partials/menu/interfaces/MenuItem'
import MenuLink from './MenuLink.vue'
import links from 'components/partials/menu/links'
export default {
  props: {
    hideSearchInput: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup () {
    const typedText = ref('')

    const searchInLinks = (search:string, links:MenuItem[]):MenuItem[] => {
      search = search.toLowerCase().trim()

      return links.filter((link:MenuItem):boolean=> {
        return link.title.toLowerCase().search(search) != -1 || link.caption.toLowerCase().search(search) != -1
      })
    }

    const visibleLinks = computed( () => {
      if(!typedText.value) {
        return links
      }
      let linksWithTypedText = {} as any

        for (const [section, sectionLinks] of Object.entries(links)) {
          linksWithTypedText[section] = searchInLinks(typedText.value, sectionLinks) as MenuItem[]
        }
      return linksWithTypedText
    })

    return {
      typedText,
      visibleLinks,
    }
  },
  components: {
    MenuLink,
  },
}
</script>
