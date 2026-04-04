<template>
  <div v-if="props.result">
    <ListHeader> Rata i płatności </ListHeader>
    <ListRow highlight>
      <template #name>Rata miesięczna netto</template>
      <template #value>{{ pln(props.result.monthlyInstallmentNet) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Rata miesięczna brutto</template>
      <template #value>{{
        pln(props.result.monthlyInstallmentGross)
      }}</template>
    </ListRow>
    <ListRow>
      <template #name>Opłata wstępna netto</template>
      <template #value>{{ pln(props.result.initialPaymentNet) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Opłata wstępna brutto</template>
      <template #value>{{ pln(props.result.initialPaymentGross) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Kwota finansowana</template>
      <template #value>{{ pln(props.result.financedAmount) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Wartość wykupu netto</template>
      <template #value>{{ pln(props.result.residualValueNet) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Wartość wykupu brutto</template>
      <template #value>{{ pln(props.result.residualValueGross) }}</template>
    </ListRow>
    <ListHeader> Łączne koszty </ListHeader>
    <ListRow>
      <template #name>Łączny koszt leasingu netto</template>
      <template #value>{{ pln(props.result.totalCostNet) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Łączny koszt leasingu brutto</template>
      <template #value>{{ pln(props.result.totalCostGross) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Łączne odsetki</template>
      <template #value>{{ pln(props.result.totalInterest) }}</template>
    </ListRow>
    <ListRow>
      <template #name>Łączny VAT</template>
      <template #value>{{ pln(props.result.totalVat) }}</template>
    </ListRow>
    <ListRow highlight>
      <template #name>VAT do odliczenia</template>
      <template #value>{{ pln(props.result.deductibleVat) }}</template>
    </ListRow>

    <ListHeader>
      Koszty uzyskania przychodu (KUP)
      <Tooltip>
        KUP to wydatki, które możesz odliczyć od przychodu, zmniejszając
        podstawę opodatkowania. Dla samochodów osobowych obowiązuje limit
        wartości pojazdu zależny od kategorii emisji CO₂.
      </Tooltip>
    </ListHeader>
    <ListRow v-if="props.isCar && props.result.kupProportion < 1">
      <template #name>
        Proporcja KUP
        <Tooltip>
          Stosunek limitu ustawowego do wartości pojazdu. Ogranicza część
          kapitałową i opłatę wstępną zaliczaną do kosztów.
        </Tooltip>
      </template>
      <template #value>{{
        formatProportion(props.result.kupProportion)
      }}</template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Łączne KUP
        <Tooltip>
          Suma wydatków leasingowych zaliczanych do kosztów uzyskania przychodu.
          Odsetki są w pełni kosztem, a część kapitałowa i opłata wstępna mogą
          być ograniczone limitem.
        </Tooltip>
      </template>
      <template #value>{{ pln(props.result.totalKup) }}</template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import { Result } from 'components/leasing/interfaces/Result'
import { pln } from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'
import ListHeader from 'components/partials/resultList/ListHeader.vue'

interface Props {
  result: Result
  isCar: boolean
}
const props = defineProps<Props>()

const formatProportion = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`
}
</script>
