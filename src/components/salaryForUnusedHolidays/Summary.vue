<template>
  <div>
    <ListRow
      name="Podstawa wymiaru świadczenia"
      :value="pln(result.basicAmount)"
    />
    <ListRow
      class="bg-teal-1"
      name="Współczynnik urlopowy"
      :value="result.holidayRate"
    />
    <ListRow
      name="Współczynnik proporcjonalny"
      :value="result.propoitonalRate"
    />
    <ListRow
      class="bg-primary text-white"
      name="Ekwiwalent"
      :value="pln(result.equivalent)"
    />
  </div>
</template>

<script lang="ts" setup>
import {SalaryForUnusedHolidaysFields} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysFields'
import {computed} from 'vue'
import {pln} from 'src/use/currencyFormat'
import ListRow from 'components/partials/ListRow.vue'
import salaryForUnusedHolidays from 'components/salaryForUnusedHolidays/salaryForUnusedHolidays'
import selfEmployment from 'components/selfEmployment/selfEmployment'

type Props = {
  input: SalaryForUnusedHolidaysFields,
}

const props = defineProps<Props>()
const result = computed(() => {
  salaryForUnusedHolidays.setParams(props.input.year)
  return salaryForUnusedHolidays.getResult(props.input)
})
</script>
