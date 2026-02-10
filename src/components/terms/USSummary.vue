<template>
  <div>
    <ListRow>
      <template #name>Wpłata zaliczki na podatek dochodowy</template>
      <template #description>do 20. dnia miesiąca</template>
    </ListRow>
    <ListRow>
      <template #name>Wpłata podatku VAT</template>
      <template #description>do 25. dnia miesiąca</template>
    </ListRow>
    <ListRow>
      <template #name>Zmiana formy opodatkowania</template>
      <template #description
        >do 20 dnia miesiąca następującego po miesiącu, w którym został
        osiągnięty pierwszy przychód w danym roku podatkowym</template
      >
    </ListRow>
    <ListRow>
      <template #name>Rozliczenie PIT</template>
      <template #description
        >do 30. kwietnia. W przypadku, gdy termin nie jest dniem roboczym termin
        zostaje przeniesiony na najbliższy dzień roboczy</template
      >
    </ListRow>
    <ListRow>
      <template #name>Termin składania formularza VAT-26</template>
      <template #description
        >do 25. dnia następnego miesiąca, w którym zostanie poniesiony pierwszy
        wydatek związany z pojazdem, nie później jednak niż w dniu przesłania
        ewidencji JPK_V7</template
      >
    </ListRow>
  </div>
</template>
<script setup lang="ts">
import ListRow from 'components/partials/resultList/ListRow.vue'
</script>
