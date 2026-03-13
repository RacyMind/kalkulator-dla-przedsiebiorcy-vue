<template>
  <div class="q-pa-md column q-gutter-sm">
    <div>
      <div class="text-subtitle2 q-mb-sm">
        Ranking form oszczędzania (wariant bazowy)
      </div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="tool in rankingRows"
          :key="tool.tool"
          class="col-12 col-lg-6 col-xl-4"
        >
          <q-card bordered flat class="fit">
            <q-card-section class="column q-gutter-xs">
              <div class="text-caption footer-text">
                Miejsce {{ tool.rank }}
              </div>
              <div class="text-h6 text-weight-bold">
                {{ tool.toolLabel }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="column q-gutter-sm">
              <div class="row items-start justify-between q-col-gutter-sm">
                <span class="col-12 col-sm-auto text-caption footer-text">
                  Wartość końcowa
                </span>
                <span class="col-12 col-sm-auto text-body1 text-weight-bold">
                  {{ pln(tool.finalValue) }}
                </span>
              </div>
              <div class="row items-start justify-between q-col-gutter-sm">
                <span class="col-12 col-sm-auto text-caption footer-text">
                  Status celu
                </span>
                <span
                  class="col-12 col-sm-auto text-weight-medium"
                  :class="tool.reachedGoal ? 'text-positive' : 'text-negative'"
                >
                  {{
                    tool.reachedGoal
                      ? 'Cel osiągnięty'
                      : `Brakuje ${pln(tool.targetGap)}`
                  }}
                </span>
              </div>
              <div class="row items-start justify-between q-col-gutter-sm">
                <span class="col-12 col-sm-auto text-caption footer-text">
                  Wymagana wpłata
                </span>
                <strong
                  v-if="tool.requiredMonthlyContribution !== null"
                  class="col-12 col-sm-auto text-weight-bold"
                >
                  {{ pln(tool.requiredMonthlyContribution) }}
                </strong>
                <strong
                  v-else
                  class="col-12 col-sm-auto text-negative text-weight-bold"
                >
                  Nieosiągalny przez limity
                </strong>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div>
      <div class="text-subtitle2 q-mb-sm">Szczegóły scenariuszy</div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="tool in toolCards"
          :key="tool.tool"
          class="col-12 col-lg-6 col-xl-4"
        >
          <q-card bordered flat class="fit">
            <q-card-section class="column q-gutter-xs">
              <div class="text-h6 text-weight-bold">
                {{ tool.toolLabel }}
              </div>
              <div class="column q-gutter-xs q-mt-sm">
                <div
                  v-for="taxRow in tool.taxRows"
                  :key="taxRow.key"
                  class="row items-start justify-between q-col-gutter-sm"
                >
                  <span class="col-12 col-sm-auto text-caption footer-text">
                    {{ taxRow.label }}
                  </span>
                  <span
                    class="col-12 col-sm-auto text-caption text-weight-medium"
                    :class="taxRow.valueClass"
                  >
                    {{ taxRow.value }}
                  </span>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-list dense class="q-py-xs">
              <q-item
                v-for="scenario in tool.scenarios"
                :key="scenario.key"
                class="rounded-borders q-mx-xs q-my-xs"
                :class="{ 'bg-row-highlight': scenario.isBase }"
              >
                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ scenario.scenarioLabel }}
                  </q-item-label>
                  <q-item-label caption>
                    Stopa zwrotu: {{ scenario.returnRateLabel }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="text-right">
                  <q-item-label class="text-weight-medium">
                    {{ pln(scenario.finalValue) }}
                  </q-item-label>
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

interface RankingRow {
  rank: number
  tool: SavingsPlanTool
  toolLabel: string
  finalValue: number
  reachedGoal: boolean
  targetGap: number
  requiredMonthlyContribution: number | null
}

interface TaxRow {
  key: string
  label: string
  value: string
  valueClass?: string
}

interface ToolCardScenario {
  key: string
  scenarioLabel: string
  returnRateLabel: string
  finalValue: number
  reachedGoal: boolean
  statusLabel: string
  isBase: boolean
}

interface ToolCard {
  tool: SavingsPlanTool
  toolLabel: string
  taxRows: TaxRow[]
  scenarios: ToolCardScenario[]
}

const props = defineProps<Props>()

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

const getTaxRows = (
  tool: SavingsPlanTool,
  totalTaxRelief: number,
  totalBelkaTax: number,
  totalIkzePayoutTax: number,
): TaxRow[] => {
  if (tool === SavingsPlanTool.Ikze) {
    return [
      {
        key: 'tax-relief',
        label: 'Ulga podatkowa',
        value: pln(totalTaxRelief),
        valueClass: 'text-positive',
      },
      {
        key: 'ikze-payout-tax',
        label: 'Podatek przy wypłacie',
        value: pln(totalIkzePayoutTax),
        valueClass: 'text-negative',
      },
    ]
  }

  if (tool === SavingsPlanTool.NoRelief) {
    return [
      {
        key: 'belka-tax',
        label: 'Podatek Belki',
        value: pln(totalBelkaTax),
        valueClass: 'text-negative',
      },
    ]
  }

  return [
    {
      key: 'no-extra-tax',
      label: 'Dodatkowy podatek',
      value: 'Brak',
    },
  ]
}

const toolCards = computed<ToolCard[]>(() =>
  props.result.toolProjections.map((toolProjection) => {
    const baseScenario = toolProjection.scenarioProjections.find(
      (scenario) => scenario.scenario === SavingsPlanScenario.Base,
    )

    return {
      tool: toolProjection.tool,
      toolLabel: getSavingsPlanToolLabel(toolProjection.tool),
      taxRows: getTaxRows(
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
          isBase: scenarioProjection.scenario === SavingsPlanScenario.Base,
        }),
      ),
    }
  }),
)
</script>
