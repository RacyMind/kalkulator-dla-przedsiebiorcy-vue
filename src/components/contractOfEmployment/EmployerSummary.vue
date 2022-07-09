<template>
  <div>
    <ListRow
      name="Wynagrodzenie brutto"
      :value="pln(result.grossAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Składki ZUS"
      :value="pln(result.contributionTotal)"
    />
    <ListRow
      name="Składka wypadkowa"
      :value="pln(result.accidentContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka rentowa"
      :value="pln(result.disabilityContribution)"
      nested
    />
    <ListRow
      name="Składka emerytalna"
      :value="pln(result.pensionContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka na Fundusz Pracy"
      :value="pln(result.fpContribution)"
      nested
    />
    <ListRow
      name="Składka na FGŚP"
      :value="pln(result.fgspContribution)"
      nested
    />
    <ListRow
      class="bg-teal-1"
      name="Składka PPK"
      :value="pln(result.ppkContribution)"
      nested
    />
    <ListRow
      class="bg-primary text-white"
      name="Suma kosztów pracodawcy"
      :value="pln(result.totalAmount)"
    />
  </div>
</template>
<script lang="ts">
import {ContractOfEmploymentInputFields} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import {PropType, computed, defineComponent} from 'vue'
import { pln } from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import employerContractOfEmployment from 'components/contractOfEmployment/employerContractOfEmployment'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractOfEmploymentInputFields>,
    },
  },
  setup (props) {
    const result = computed(() => {
      employerContractOfEmployment.setParams(props.input.year)
      return employerContractOfEmployment.getMonthlyResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
})
</script>
