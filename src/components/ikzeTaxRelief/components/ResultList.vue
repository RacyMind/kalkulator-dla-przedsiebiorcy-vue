<template>
  <div v-if="props.result">
    <ListRow>
      <template #name>
        Limit IKZE
      </template>
      <template #value>
        {{ pln(props.result.ikzeLimit) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Wpłata na IKZE
      </template>
      <template #value>
        {{ pln(props.result.ikzeContribution) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podstawa opodatkowania przed IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxBaseBeforeRelief) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podstawa opodatkowania po IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxBaseAfterRelief) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podatek przed IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxBeforeRelief) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Podatek po IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxAfterRelief) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Oszczędność podatkowa
      </template>
      <template #value>
        {{ pln(props.result.taxSaving) }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import {Result} from 'components/ikzeTaxRelief/interfaces/Result'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()
</script>
