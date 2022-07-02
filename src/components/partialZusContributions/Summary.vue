<template>
  <div>
    <ListRow
      name="Podstawa wymiaru składek"
      :value="pln(result.basisForZusContributions)"
    />
    <ListRow
      class="bg-teal-1"
      name="Składka chorobowa"
      :value="pln(result.sickContribution)"
    />
    <ListRow
      name="Składka rentowa"
      :value="pln(result.disabilityContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka emerytalna"
      :value="pln(result.pensionContribution)"
      nested
    />
    <ListRow
      name="Składka wypadkowa"
      :value="pln(result.accidentContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka na Fundusz Pracy"
      :value="pln(result.fpContribution)"
      nested
    />
    <ListRow
      class="bg-primary text-white"
      name="Składki ZUS"
      :value="pln(result.contributionTotal)"
    />
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import { pln } from 'src/use/currencyFormat'
import partialZusContributions from 'components/partialZusContributions/partialZusContributions'
import helpers from 'src/logic/helpers'
import {PartialZusContributionInputFields} from 'components/partialZusContributions/interfaces/PartialZusContributionInputFields'
import ListRow from 'components/partials/ListRow.vue'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<PartialZusContributionInputFields>,
      required: true,
    },
  },
  setup(props) {
    const result = computed(() => {
      partialZusContributions.setParams(helpers.getDefaultYear())
      return partialZusContributions.getResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
  components: {
    ListRow,
  },
})
</script>
