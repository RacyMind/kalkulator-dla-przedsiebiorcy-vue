<template>
  <div v-if="props.result">
    <list-row>
      <template #name>
        Limit IKZE
      </template>
      <template #value>
        {{ pln(props.result.ikzeLimit) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Wpłata na IKZE
      </template>
      <template #value>
        {{ pln(props.result.ikzeContribution) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Podstawa opodatkowania przed IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxBaseBeforeRelief) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Podstawa opodatkowania po IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxBaseAfterRelief) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Podatek przed IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxBeforeRelief) }}
      </template>
    </list-row>
    <list-row>
      <template #name>
        Podatek po IKZE
      </template>
      <template #value>
        {{ pln(props.result.taxAfterRelief) }}
      </template>
    </list-row>
    <list-row highlight>
      <template #name>
        Oszczędność podatkowa
      </template>
      <template #value>
        {{ pln(props.result.taxSaving) }}
      </template>
    </list-row>
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
