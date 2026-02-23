<template>
  <div v-if="baseScenarioProjection">
    <ListRow>
      <template #name> Kwota celu </template>
      <template #value>
        {{ pln(props.result.goalAmount) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Horyzont oszczędzania </template>
      <template #value>
        {{ horizonLabel }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Zadeklarowana miesięczna wpłata </template>
      <template #value>
        {{ pln(props.result.monthlyContribution) }}
      </template>
    </ListRow>
    <ListRow v-if="activeToolAnnualLimit !== null">
      <template #name> Roczny limit wpłat ({{ activeToolLabel }}) </template>
      <template #value>
        {{ pln(activeToolAnnualLimit) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Założony roczny wzrost limitów </template>
      <template #value>
        {{ growthRateLabel }}
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Średnia miesięczna wpłata efektywna (wariant bazowy)
      </template>
      <template #value>
        {{ pln(averageEffectiveMonthlyContribution) }}
      </template>
    </ListRow>
    <ListRow highlight>
      <template #name>
        Wartość końcowa na czysto (wariant bazowy, {{ activeToolLabel }})
      </template>
      <template #value>
        {{ pln(baseScenarioProjection.finalValue) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Status realizacji celu </template>
      <template #value>
        <span v-if="baseScenarioProjection.reachedGoal" class="text-positive">
          Cel osiągnięty
        </span>
        <span v-else class="text-negative">
          Brakuje {{ pln(baseScenarioProjection.targetGap) }}
        </span>
      </template>
    </ListRow>
    <ListRow>
      <template #name>
        Wymagana miesięczna wpłata dla celu (wariant bazowy)
      </template>
      <template #value>
        <span
          v-if="baseScenarioProjection.requiredMonthlyContribution !== null"
        >
          {{ pln(baseScenarioProjection.requiredMonthlyContribution) }}
        </span>
        <span v-else> Cel nieosiągalny przy limicie wpłat </span>
      </template>
    </ListRow>
    <ListRow v-if="taxSummary">
      <template #name> Podatki i ulgi (wariant bazowy) </template>
      <template #value>
        {{ taxSummary }}
      </template>
    </ListRow>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Result } from 'components/savingsPlan/interfaces/Result'
import {
  getSavingsPlanToolLabel,
  SavingsPlanScenario,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { pln } from 'src/composables/currencyFormat'
import helpers from 'src/logic/helpers'
import ListRow from 'components/partials/resultList/ListRow.vue'

interface Props {
  result: Result
}

const props = defineProps<Props>()

const activeToolProjection = computed(() =>
  props.result.toolProjections.find(
    (projection) => projection.tool === props.result.activeTool,
  ),
)

const baseScenarioProjection = computed(() =>
  activeToolProjection.value?.scenarioProjections.find(
    (projection) => projection.scenario === SavingsPlanScenario.Base,
  ),
)

const activeToolLabel = computed(() =>
  getSavingsPlanToolLabel(props.result.activeTool),
)

const activeToolAnnualLimit = computed(
  () => activeToolProjection.value?.annualLimit ?? null,
)

const growthRateLabel = computed(
  () => `${helpers.formatNumber(props.result.annualLimitGrowthRate, 2)}%`,
)

const horizonLabel = computed(() => {
  const years = helpers.round(props.result.horizonMonths / 12, 2)
  return `${years} lat`
})

const averageEffectiveMonthlyContribution = computed(() => {
  if (!baseScenarioProjection.value) {
    return 0
  }

  return helpers.round(
    baseScenarioProjection.value.totalEffectiveContributions /
      props.result.horizonMonths,
    2,
  )
})

const taxSummary = computed(() => {
  if (!baseScenarioProjection.value) {
    return ''
  }

  if (props.result.activeTool === SavingsPlanTool.Ikze) {
    return `Ulga: ${pln(
      baseScenarioProjection.value.totalTaxRelief,
    )}, podatek przy wypłacie: ${pln(
      baseScenarioProjection.value.totalIkzePayoutTax,
    )}`
  }

  if (props.result.activeTool === SavingsPlanTool.NoRelief) {
    return `Podatek Belki: ${pln(baseScenarioProjection.value.totalBelkaTax)}`
  }

  return ''
})
</script>
