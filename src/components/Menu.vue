<template>
  <div>
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Firma
    </h6>
    <MenuLink
      v-for="link in constants.MENU.BUSINESS"
      :key="link.title"
      v-bind="link"
    />
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Praca
    </h6>
    <MenuLink
      v-for="link in constants.MENU.WORK"
      :key="link.title"
      v-bind="link"
    />
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Oprocentowanie
    </h6>
    <MenuLink
      v-for="link in constants.MENU.PERCENTAGE"
      :key="link.title"
      v-bind="link"
    />
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Waluty
    </h6>
    <MenuLink
      v-for="link in constants.MENU.CURRENCIES"
      :key="link.title"
      v-bind="link"
    />
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Aplikacja
    </h6>
    <MenuLink
      v-for="link in constants.MENU.APP"
      :key="link.title"
      v-bind="link"
    />
  </div>
</template>

<script>
import constants from 'src/logic/constants'
import MenuLink from 'components/MenuLink'
export default {
  setup () {
    return {
      constants,
    }
  },
  components: {
    MenuLink,
  },
}
</script>
