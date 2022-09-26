<template>
  <q-page
    class="q-py-md full-width c-partialZusContributions"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description"/>
        Wypełnij formularz
      </SectionHeader>
      <Form
        class="q-mt-md q-mb-lg q-px-md"
        @save="save"
      />
      <Advert/>
      <SectionHeader ref="scrollTarget">
        <q-icon name="o_credit_card"/>
        Podsumowanie
      </SectionHeader>
      <Summary :input="inputFields"/>
      <SectionHeader>
        <q-icon name="o_pie_chart"/>
        Wykres
      </SectionHeader>
      <Statistics :input="inputFields"/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {PartialZusContributionInputFields} from 'components/partialZusContributions/interfaces/PartialZusContributionInputFields'
import {Ref, ref} from 'vue'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/partialZusContributions/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Statistics from 'components/partialZusContributions/Statistics.vue'
import Summary from 'components/partialZusContributions/Summary.vue'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Składki ZUS za część miesiąca',
  },
]

const year = ref(helpers.getDefaultYear())
const openModal = ref(false)
const scrollTarget = ref(null) as any

const inputFields: Ref<PartialZusContributionInputFields> = ref({
  accidentContributionRate: 0,
  customBasisForZus: 0,
  daysInMonth: 31,
  daysOfRunningBusiness: 0,
  isFpContribution: false,
  isSickContribution: false,
  isSmallZus: false,
})

const save = (input: PartialZusContributionInputFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
