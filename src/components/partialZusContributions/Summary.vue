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
import {PartialZusContributionInputFields} from 'components/partialZusContributions/interfaces/PartialZusContributionInputFields'
import {PropType, computed, defineComponent} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import helpers from 'src/logic/helpers'
import partialZusContributions from 'components/partialZusContributions/partialZusContributions'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<PartialZusContributionInputFields>,
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
})
</script>
