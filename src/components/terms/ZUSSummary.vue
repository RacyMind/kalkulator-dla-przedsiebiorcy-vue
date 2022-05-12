<template>
  <div>
    <ListRow
      name="Wpłata składek - dla jednostek budżetowych i samorządowych zakładów budżetowych"
      value="do 5. dnia następnego miesiąca"
      :inline="false"
    />
    <ListRow
      class="bg-teal-1"
      name="Wpłata składek - dla płatników posiadających osobowość prawną"
      value="do 15. dnia następnego miesiąca"
      :inline="false"
    />
    <ListRow
      name="Wpłata składek - dla pozostałych płatników składek"
      value="do 20. dnia następnego miesiąca"
      :inline="false"
    />
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import ListRow from 'components/partials/ListRow.vue'

export default defineComponent({
  components: {
    ListRow,
  },
})
</script>
