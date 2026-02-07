<template>
  <div>
    <ListRow
      name="Termin składania wniosku Wn-U-G"
      value="do ostatniego dnia następnego miesiąca"
      :inline="false"
    />
    <ListRow
      name="Termin składania wniosku Wn-D"
      value="do 25. dnia następnego miesiąca"
      :inline="false"
    />
  </div>
</template>
<script setup lang="ts">
import ListRow from 'components/partials/ListRow.vue'
</script>
