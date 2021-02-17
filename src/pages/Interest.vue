<template>
  <q-page
    class="q-pa-md full-width c-interest"
    style="max-width:800px;"
  >
    <div class="full-width bg-white">
      <SectionHeader>
        <q-icon name="o_description" />
        Wypełnij formularz
      </SectionHeader>
      <InterestForm
        class="q-my-lg q-px-md"
      />
      <Advert />
      <SectionHeader>
        <q-icon name="o_credit_card" />
        Podsumowanie
      </SectionHeader>
      <InterestTable />
      <SectionHeader>
        <q-icon name="o_pie_chart" />
        Wykres
      </SectionHeader>
      <InterestStatistics />
    </div>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'
import InterestForm from 'components/interest/InterestForm'
import InterestTable from 'components/interest/InterestTable'
import InterestStatistics from 'components/interest/InterestStatistics'
import Advert from 'components/Advert'

export default {
  components: {
    SectionHeader,
    InterestForm,
    InterestTable,
    InterestStatistics,
    Advert,
  },
}
</script>
