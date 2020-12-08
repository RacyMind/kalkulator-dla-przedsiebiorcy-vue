<template>
  <q-page
    class="q-pa-md full-width"
    style="max-width:800px;"
  >
    <q-form>
      <div class="q-pa-md full-width">
        <SectionHeader>
          <q-icon name="o_description" />
          Wypełnij formularz
        </SectionHeader>
        <div class="row justify-between">
          <div class="col-6 q-pr-sm">
            <q-input
              v-model="amount"
              label="Kwota*"
              autofocus
            />
            <div class="q-gutter-sm">
              <q-radio
                v-model="typeAmount"
                val="net"
                label="netto"
              />
              <q-radio
                v-model="typeAmount"
                val="gross"
                label="brutto"
              />
            </div>
          </div>
          <div class="col-6 q-pl-sm">
            <q-select
              v-model="rate"
              :options="vatValues"
              label="Stawka podatku VAT*"
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-6">
            <q-btn
              color="primary"
              label="Oblicz"
            />
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import SectionHeader from 'components/SectionHeader'

export default {
  data () {
    return {
      amount: null,
      typeAmount: {
        type: String,
        default: 'net'
      },
      rate: null,
      vatValues: [
        {
          label: '0%',
          value: 0
        },
        {
          label: '5%',
          value: 5
        },
        {
          label: '8%',
          value: 8
        },
        {
          label: '23%',
          value: 23
        }
      ]
    }
  },
  components: {
    SectionHeader
  }
}
</script>
