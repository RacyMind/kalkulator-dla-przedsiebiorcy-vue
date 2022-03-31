<template>
  <div>
    <ListRow
      name="Termin składania wniosku Wn-U-G"
      value="do ostatniego dnia następnego miesiąca"
      :inline="false"
    />
    <ListRow
      class="bg-teal-1"
      name="Termin składania wniosku Wn-D"
      value="do 25. dnia następnego miesiąca"
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
