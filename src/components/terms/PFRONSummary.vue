<template>
  <div>
    <ListRow>
      <template #name>Termin składania wniosku Wn-U-G</template>
      <template #description>do ostatniego dnia następnego miesiąca</template>
    </ListRow>
    <ListRow>
      <template #name>Termin składania wniosku Wn-D</template>
      <template #description>do 25. dnia następnego miesiąca</template>
    </ListRow>
  </div>
</template>
<script setup lang="ts">
import ListRow from 'components/partials/resultList/ListRow.vue'
</script>
