<template>
  <div>
    <ListRow>
      <template #name
        >Wpłata składek - dla jednostek budżetowych i samorządowych zakładów
        budżetowych</template
      >
      <template #description>do 5. dnia następnego miesiąca</template>
    </ListRow>
    <ListRow>
      <template #name
        >Wpłata składek - dla płatników posiadających osobowość prawną</template
      >
      <template #description>do 15. dnia następnego miesiąca</template>
    </ListRow>
    <ListRow>
      <template #name
        >Wpłata składek - dla pozostałych płatników składek</template
      >
      <template #description>do 20. dnia następnego miesiąca</template>
    </ListRow>
  </div>
</template>
<script setup lang="ts">
import ListRow from 'components/partials/resultList/ListRow.vue'
</script>
