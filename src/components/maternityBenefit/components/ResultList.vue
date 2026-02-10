<template>
  <div v-if="props.result">
    <ListRow>
      <template #name> Podstawa zasiłku </template>
      <template #value>
        {{ pln(props.result.benefitBasis) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Łączny wymiar urlopów </template>
      <template #value>
        {{ props.result.leavePeriods.totalWeeks }} tyg. ({{
          props.result.leavePeriods.totalDays
        }}
        dni)
      </template>
    </ListRow>
    <ListRow>
      <template #name> Stawka dzienna (100%) </template>
      <template #value>
        {{ pln(props.result.variantB.maternityDailyRate) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Stawka dzienna (81,5%) </template>
      <template #value>
        {{ pln(props.result.variantA.maternityDailyRate) }}
      </template>
    </ListRow>
    <ListRow>
      <template #name> Stawka dzienna (70%) </template>
      <template #value>
        {{ pln(props.result.variantB.parentalDailyRate) }}
      </template>
    </ListRow>

    <q-card flat class="q-mt-md">
      <q-card-section class="bg-brand text-white">
        <div class="text-subtitle1 text-weight-bold">Wariant A — 81,5%</div>
        <div class="text-caption">Stała stawka przez cały okres</div>
      </q-card-section>
      <q-list>
        <ListRow>
          <template #name>
            Urlop macierzyński ({{
              props.result.leavePeriods.maternityLeaveWeeks
            }}
            tyg.)
          </template>
          <template #value>
            {{ pln(props.result.variantA.maternityLeaveAmount) }}
          </template>
        </ListRow>
        <ListRow>
          <template #name>
            Kwota miesięczna <Tooltip>{{ monthlyTooltip }}</Tooltip>
          </template>
          <template #value>
            {{ pln(props.result.variantA.maternityMonthlyAmount) }}
          </template>
        </ListRow>
        <ListRow>
          <template #name>
            Urlop rodzicielski ({{
              props.result.leavePeriods.parentalLeaveWeeks
            }}
            tyg.)
          </template>
          <template #value>
            {{ pln(props.result.variantA.parentalLeaveAmount) }}
          </template>
        </ListRow>
        <ListRow>
          <template #name>
            Kwota miesięczna <Tooltip>{{ monthlyTooltip }}</Tooltip>
          </template>
          <template #value>
            {{ pln(props.result.variantA.parentalMonthlyAmount) }}
          </template>
        </ListRow>
        <ListRow highlight>
          <template #name>Łącznie</template>
          <template #value>
            {{ pln(props.result.variantA.totalAmount) }}
          </template>
        </ListRow>
      </q-list>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section class="bg-brand text-white">
        <div class="text-subtitle1 text-weight-bold">
          Wariant B — 100% / 70%
        </div>
        <div class="text-caption">Zmienna stawka</div>
      </q-card-section>
      <q-list>
        <ListRow>
          <template #name>
            Urlop macierzyński ({{
              props.result.leavePeriods.maternityLeaveWeeks
            }}
            tyg.)
          </template>
          <template #value>
            {{ pln(props.result.variantB.maternityLeaveAmount) }}
          </template>
        </ListRow>
        <ListRow>
          <template #name>
            Kwota miesięczna (100%)
            <Tooltip>{{ monthlyTooltip }}</Tooltip>
          </template>
          <template #value>
            {{ pln(props.result.variantB.maternityMonthlyAmount) }}
          </template>
        </ListRow>
        <ListRow>
          <template #name>
            Urlop rodzicielski ({{
              props.result.leavePeriods.parentalLeaveWeeks
            }}
            tyg.)
          </template>
          <template #value>
            {{ pln(props.result.variantB.parentalLeaveAmount) }}
          </template>
        </ListRow>
        <ListRow>
          <template #name>
            Kwota miesięczna (70%)
            <Tooltip>{{ monthlyTooltip }}</Tooltip>
          </template>
          <template #value>
            {{ pln(props.result.variantB.parentalMonthlyAmount) }}
          </template>
        </ListRow>
        <ListRow highlight>
          <template #name>Łącznie</template>
          <template #value>
            {{ pln(props.result.variantB.totalAmount) }}
          </template>
        </ListRow>
      </q-list>
    </q-card>

    <q-card flat class="q-mt-md">
      <q-card-section class="bg-brand text-white">
        <div class="text-subtitle2 text-weight-bold">
          Dodatkowy urlop rodzicielski — drugi rodzic
        </div>
        <div class="text-caption">
          9 tygodni ({{ props.result.secondParentDays }} dni) × 70%
        </div>
      </q-card-section>
      <q-list>
        <ListRow>
          <template #name>
            Kwota miesięczna (70%)
            <Tooltip>{{ monthlyTooltip }}</Tooltip>
          </template>
          <template #value>
            {{ pln(props.result.secondParentMonthlyAmount) }}
          </template>
        </ListRow>
        <ListRow highlight>
          <template #name>Łącznie za 9 tygodni</template>
          <template #value>
            {{ pln(props.result.secondParentBenefit) }}
          </template>
        </ListRow>
      </q-list>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Result } from 'components/maternityBenefit/interfaces/Result'
import { pln } from 'src/composables/currencyFormat'
import ListRow from 'components/partials/resultList/ListRow.vue'
import Tooltip from 'components/partials/Tooltip.vue'

interface Props {
  result: Result
}
const props = defineProps<Props>()

const monthlyTooltip =
  'Kwota przybliżona. Przyjęto 30 dni w miesiącu. Dokładna kwota zależy od liczby dni w danym miesiącu.'
</script>
