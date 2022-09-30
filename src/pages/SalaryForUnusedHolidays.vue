<template>
  <q-page
    class="q-py-md full-width c-contractOfMandate"
    style="max-width:800px;">
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_date_range"/>
        Rok podatkowy
      </SectionHeader>
      <ChooseYear
        v-model="year"
        class="q-mt-md q-mb-lg q-px-md"/>
      <SectionHeader>
        <q-icon name="o_description"/>
        Wypełnij formularz
      </SectionHeader>
      <Form
        :year="year"
        @save="save"
        class="q-mt-md q-mb-lg q-px-md"
      />
      <Advert/>
      <SectionHeader ref="scrollTarget">
        <div class="row justify-between">
          <div>
            <q-icon name="o_credit_card"/>
            Podsumowanie
          </div>
        </div>
      </SectionHeader>
      <Summary :input="inputFields"/>
    </div>
    <Footer/>
  </q-page>
</template>

<script lang="ts" setup>
import {Ref, ref, watch} from 'vue'
import {SalaryForUnusedHolidaysFields} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysFields'
import {useBreadcrumbStore} from 'stores/breadcrumbStore'
import Advert from 'components/partials/Advert.vue'
import ChooseYear from 'components/partials/ChooseYear.vue'
import Footer from 'components/partials/Footer.vue'
import Form from 'components/salaryForUnusedHolidays/Form.vue'
import SectionHeader from 'components/partials/SectionHeader.vue'
import Summary from 'components/salaryForUnusedHolidays/Summary.vue'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.items = [
  {
    name: 'Ekwiwalent za niewykorzystany urlop',
  },
]

const year = ref(helpers.getDefaultYear())
const scrollTarget = ref(null) as any

const inputFields: Ref<SalaryForUnusedHolidaysFields> = ref({
  amount: 0,
  dailyNorm: 0,
  holidayHours: 0,
  year: helpers.getDefaultYear(),
  workingTime: 0,
})

watch(year, () => {
  inputFields.value.amount = 0
})

const save = (input: SalaryForUnusedHolidaysFields) => {
  inputFields.value = input
  helpers.scrollToElement(scrollTarget?.value?.$el)
}
</script>
