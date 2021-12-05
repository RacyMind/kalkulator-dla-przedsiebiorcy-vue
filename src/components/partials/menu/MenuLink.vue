<template>
  <div>
    <template v-if="isExternalLink">
      <q-item
        clickable
        exact
        tag="a"
        :href="link"
        :class="className"
        class="q-pa-none"
        style="border-bottom: 1px solid white"
      >
        <q-item-section
          style="max-width:25px"
        >
          <div
            class="s-bg bg-module"></div>
        </q-item-section>

        <q-item-section class="q-py-sm q-pr-sm">
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption>
            {{ caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-item
        clickable
        exact
        :to="link"
        :class="className"
        class="q-pa-none"
        style="border-bottom: 1px solid white"
      >
        <q-item-section
          style="max-width:25px"
        >
          <div
            class="s-bg bg-module"></div>
        </q-item-section>

        <q-item-section class="q-py-sm q-pr-sm">
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption>
            {{ caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '',
    },

    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    isExternalLink () {
      return this.link.includes('https://')
    },
  },
}
</script>
<style lang="scss">
.s-bg {
  width: 100%;
  height: 100%;
  display: inline-block;
}
</style>
