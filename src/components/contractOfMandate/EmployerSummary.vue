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
import {computed, defineComponent, PropType} from 'vue'
import { pln } from 'src/use/currencyFormat'
import employerContractOfMandate from 'components/contractOfMandate/employerContractOfMandate'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import ListRow from 'components/partials/ListRow.vue'

export default defineComponent({
  components: {
    ListRow,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractOfMandateInputFields>,
    },
  },
  setup (props) {
    const result = computed(() => {
      employerContractOfMandate.setParams(props.input.year)
      return employerContractOfMandate.getMonthlyResult(props.input)
    })

    return {
      pln,
      result,
    }
  },
})
</script>
