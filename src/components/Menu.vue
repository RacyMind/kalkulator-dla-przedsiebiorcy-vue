<template>
  <div>
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Firma
    </h6>
    <MenuLink
      v-for="link in $constants.MENU.BUSINESS"
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
      v-for="link in $constants.MENU.WORK"
      :key="link.title"
      v-bind="link"
    />
    <h6
      class="q-my-md"
      style="margin-left: 32px;"
    >
      Polski Ład
    </h6>
    <MenuLink
      v-for="link in $constants.MENU.POLSKI_LAD"
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
      v-for="link in $constants.MENU.PERCENTAGE"
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
      v-for="link in $constants.MENU.CURRENCIES"
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
      v-for="link in $constants.MENU.APP"
      :key="link.title"
      v-bind="link"
    />
  </div>
</template>

<script>
import MenuLink from 'components/MenuLink'
export default {
  components: {
    MenuLink,
  },
}
</script>
