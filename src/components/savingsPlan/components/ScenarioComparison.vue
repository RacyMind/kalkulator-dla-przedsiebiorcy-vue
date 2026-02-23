<template>
  <div class="q-pa-md column q-gutter-md">
    <div>
      <div class="text-subtitle2 q-mb-sm">
        Ranking narzędzi (wariant bazowy)
      </div>
      <div class="cardGrid">
        <q-card
          v-for="tool in rankingRows"
          :key="tool.tool"
          bordered
          flat
          class="comparisonCard"
        >
          <q-card-section class="q-pb-sm">
            <div class="text-caption text-grey-7">Miejsce {{ tool.rank }}</div>
            <div class="text-h6">
              {{ tool.toolLabel }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption text-grey-7">Wartość końcowa</div>
            <div class="text-subtitle1 text-weight-medium">
              {{ pln(tool.finalValue) }}
            </div>
            <div class="q-mt-sm">
              <span v-if="tool.reachedGoal" class="text-positive">
                Cel osiągnięty
              </span>
              <span v-else class="text-negative">
                Brakuje {{ pln(tool.targetGap) }}
              </span>
            </div>
            <div class="text-caption q-mt-sm">
              Wymagana wpłata:
              <strong v-if="tool.requiredMonthlyContribution !== null">
                {{ pln(tool.requiredMonthlyContribution) }}
              </strong>
              <strong v-else> Nieosiągalny przez limity </strong>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div>
      <div class="text-subtitle2 q-mb-sm">Szczegóły scenariuszy</div>
      <div class="cardGrid">
        <q-card
          v-for="tool in toolCards"
          :key="tool.tool"
          bordered
          flat
          class="comparisonCard"
        >
          <q-card-section>
            <div class="text-h6">
              {{ tool.toolLabel }}
            </div>
            <div class="text-caption text-grey-7">
              {{ tool.taxSummary }}
            </div>
          </q-card-section>
          <q-separator />
          <q-list dense>
            <q-item v-for="scenario in tool.scenarios" :key="scenario.key">
              <q-item-section>
                <q-item-label>{{ scenario.scenarioLabel }}</q-item-label>
                <q-item-label caption>
                  Stopa zwrotu: {{ scenario.returnRateLabel }}
                </q-item-label>
              </q-item-section>
              <q-item-section side class="text-right">
                <q-item-label>{{ pln(scenario.finalValue) }}</q-item-label>
                <q-item-label
                  caption
                  :class="
                    scenario.reachedGoal ? 'text-positive' : 'text-negative'
                  "
                >
                  {{ scenario.statusLabel }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Result } from 'components/savingsPlan/interfaces/Result'
import {
  getSavingsPlanScenarioLabel,
  getSavingsPlanToolLabel,
  SavingsPlanScenario,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { pln } from 'src/composables/currencyFormat'
import helpers from 'src/logic/helpers'

interface Props {
  result: Result
}

const props = defineProps<Props>()

interface RankingRow {
  rank: number
  tool: SavingsPlanTool
  toolLabel: string
  finalValue: number
  reachedGoal: boolean
  targetGap: number
  requiredMonthlyContribution: number | null
}

const rankingRows = computed<RankingRow[]>(() => {
  const rows = props.result.toolProjections
    .map((toolProjection) => {
      const baseScenario = toolProjection.scenarioProjections.find(
        (scenario) => scenario.scenario === SavingsPlanScenario.Base,
      )

      if (baseScenario === undefined) {
        return undefined
      }

      return {
        tool: toolProjection.tool,
        toolLabel: getSavingsPlanToolLabel(toolProjection.tool),
        finalValue: baseScenario.finalValue,
        reachedGoal: baseScenario.reachedGoal,
        targetGap: baseScenario.targetGap,
        requiredMonthlyContribution: baseScenario.requiredMonthlyContribution,
      }
    })
    .filter((row): row is Omit<RankingRow, 'rank'> => row !== undefined)
    .sort((first, second) => second.finalValue - first.finalValue)

  return rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }))
})

const formatPercent = (value: number): string =>
  `${helpers.formatNumber(value, 2)}%`

const getTaxSummary = (
  tool: SavingsPlanTool,
  totalTaxRelief: number,
  totalBelkaTax: number,
  totalIkzePayoutTax: number,
) => {
  if (tool === SavingsPlanTool.Ikze) {
    return `Ulga: ${pln(totalTaxRelief)}, podatek przy wypłacie: ${pln(
      totalIkzePayoutTax,
    )}`
  }

  if (tool === SavingsPlanTool.NoRelief) {
    return `Podatek Belki: ${pln(totalBelkaTax)}`
  }

  return 'Brak dodatkowego podatku'
}

const toolCards = computed(() =>
  props.result.toolProjections.map((toolProjection) => {
    const baseScenario = toolProjection.scenarioProjections.find(
      (scenario) => scenario.scenario === SavingsPlanScenario.Base,
    )

    return {
      tool: toolProjection.tool,
      toolLabel: getSavingsPlanToolLabel(toolProjection.tool),
      taxSummary: getTaxSummary(
        toolProjection.tool,
        baseScenario?.totalTaxRelief ?? 0,
        baseScenario?.totalBelkaTax ?? 0,
        baseScenario?.totalIkzePayoutTax ?? 0,
      ),
      scenarios: toolProjection.scenarioProjections.map(
        (scenarioProjection) => ({
          key: `${toolProjection.tool}-${scenarioProjection.scenario}`,
          scenarioLabel: getSavingsPlanScenarioLabel(
            scenarioProjection.scenario,
          ),
          returnRateLabel: formatPercent(scenarioProjection.annualReturnRate),
          finalValue: scenarioProjection.finalValue,
          reachedGoal: scenarioProjection.reachedGoal,
          statusLabel: scenarioProjection.reachedGoal
            ? 'Cel osiągnięty'
            : `Brakuje ${pln(scenarioProjection.targetGap)}`,
        }),
      ),
    }
  }),
)
</script>

<style lang="scss" scoped>
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.comparisonCard {
  height: 100%;
}
</style>
