<template>
  <ModulePageLayout class="c-percentage">
    <SectionHeader>
      Wypełnij formularz
    </SectionHeader>
    <Form @submit="handleSubmit" />
    <Advert />

    <q-tabs
      ref="qtabs"
      v-model="tab"
      inline-label
      class="bg-primary text-white shadow-2"
      :breakpoint="0"
      align="justify">
      <q-tab
        :name="Tabs.Summary"
        label="Podsumowanie" />
      <q-tab
        :name="Tabs.Payouts"
        label="Wypłaty" />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable>
      <q-tab-panel
        :name="Tabs.Summary"
        class="q-pa-none">
        <template v-if="store.result">
          <ResultList :result="store.result" />
        </template>
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
      <q-tab-panel
        :name="Tabs.Payouts"
        class="q-pa-none">
        <template v-if="store.result">
          <MonthlyDetailsList :result="store.result" />
        </template>
        <div
          v-else
          class="q-pa-md">
          Brak danych
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </ModulePageLayout>
</template>

<script setup lang="ts">
import { CoiCalculator } from 'components/polishBonds/logic/CoiCalculator'
import { CoiInputFields } from 'components/polishBonds/interfaces/CoiInputFields'
import { DorCalculator } from 'components/polishBonds/logic/DorCalculator'
import { DorInputFields } from 'components/polishBonds/interfaces/DorInputFields'
import { EdoCalculator } from 'components/polishBonds/logic/EdoCalculator'
import { EdoInputFields } from 'components/polishBonds/interfaces/EdoInputFields'
import { OtsCalculator } from 'components/polishBonds/logic/OtsCalculator'
import { OtsInputFields } from 'components/polishBonds/interfaces/OtsInputFields'
import { QTabs } from 'quasar'
import { Ref, ref } from 'vue'
import { Result } from 'components/polishBonds/interfaces/Result'
import { RorCalculator } from 'components/polishBonds/logic/RorCalculator'
import { RorInputFields } from 'components/polishBonds/interfaces/RorInputFields'
import { TosCalculator } from 'components/polishBonds/logic/TosCalculator'
import { TosInputFields } from 'components/polishBonds/interfaces/TosInputFields'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { usePolishBondsStore } from 'components/polishBonds/store'
import Advert from 'components/partials/Advert.vue'
import Form from 'components/polishBonds/components/Form.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import MonthlyDetailsList from 'components/polishBonds/components/MonthlyDetailsList.vue'
import ResultList from 'components/polishBonds/components/ResultList.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import helpers from 'src/logic/helpers'

enum Tabs {
  Summary = 'summary',
  Payouts = 'payouts',
}

const store = usePolishBondsStore()
const breadcrumbStore = useBreadcrumbStore()

breadcrumbStore.items = [
  {
    name: 'Obligacje skarbowe',
  },
]

const tab = ref(Tabs.Summary)
const qtabs: Ref<QTabs | null> = ref(null)

type Calculator<T, R> = {
  setInputData(inputFields: T): Calculator<T, R>
  calculate(): Calculator<T, R>
  getResult(): R
}

function useCalculator<T>(
  calculator: Calculator<T, Result>,
  inputFields: T,
): void {
  store.result = calculator.setInputData(inputFields).calculate().getResult()
}

const prepareCommonInputFields = () => {
  if (!store.commonInputFields) return null

  return {
    boughtBondCount: store.commonInputFields.boughtBondCount,
    yearlyInflationRate: helpers.round(store.commonInputFields.yearlyInflationRate / 100, 4),
    belkaTax: store.commonInputFields.belkaTax,
  }
}

const calculateEdo = () => {
  const common = prepareCommonInputFields()
  const form = store.edoInputFields

  if (!common || !form) {
    return
  }

  const inputFields: EdoInputFields = {
    ...common,
    initialInterestRate: helpers.round(form.initialInterestRate / 100, 4),
  }

  useCalculator(new EdoCalculator(), inputFields)
}

const calculateCoi = () => {
  const common = prepareCommonInputFields()
  const form = store.coiInputFields

  if (!common || !form) return

  const inputFields: CoiInputFields = {
    ...common,
    initialInterestRate: helpers.round(form.initialInterestRate / 100, 4),
  }

  useCalculator(new CoiCalculator(), inputFields)
}

const calculateTos = () => {
  const common = prepareCommonInputFields()
  const form = store.tosInputFields

  if (!common || !form) return

  const inputFields: TosInputFields = {
    ...common,
    interestRate: helpers.round(form.interestRate / 100, 4),
  }

  useCalculator(new TosCalculator(), inputFields)
}

const calculateOts = () => {
  const common = prepareCommonInputFields()
  const form = store.otsInputFields

  if (!common || !form) return

  const inputFields: OtsInputFields = {
    ...common,
    interestRate: helpers.round(form.interestRate / 100, 4),
    initialInterestRate: helpers.round(form.interestRate / 100, 4),
  }

  useCalculator(new OtsCalculator(), inputFields)
}

const calculateRor = () => {
  const common = prepareCommonInputFields()
  const form = store.rorInputFields

  if (!common || !form) return

  const inputFields: RorInputFields = {
    ...common,
    initialInterestRate: helpers.round(form.initialInterestRate / 100, 4),
    nbpReferenceRates: form.nbpReferenceRates.map((rate: number) => helpers.round(rate / 100, 4)),
  }

  useCalculator(new RorCalculator(), inputFields)
}

const calculateDor = () => {
  const common = prepareCommonInputFields()
  const form = store.dorInputFields

  if (!common || !form) return

  const inputFields: DorInputFields = {
    ...common,
    initialInterestRate: helpers.round(form.initialInterestRate / 100, 4),
    nbpReferenceRates: form.nbpReferenceRates.map((rate: number) => helpers.round(rate / 100, 4)),
  }

  useCalculator(new DorCalculator(), inputFields)
}

const handleSubmit = () => {
  helpers.scrollToElement(qtabs?.value?.$el)

  switch (store.selectedBondType) {
    case 'EDO':
      calculateEdo()
      break
    case 'COI':
      calculateCoi()
      break
    case 'TOS':
      calculateTos()
      break
    case 'OTS':
      calculateOts()
      break
    case 'ROR':
      calculateRor()
      break
    case 'DOR':
      calculateDor()
      break
  }
}
</script>
