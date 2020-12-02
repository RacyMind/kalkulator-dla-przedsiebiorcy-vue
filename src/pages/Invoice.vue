<template>
  <q-page class="flex flex-center">
    <q-form>
      <div class="row">
        <div class="col-6">
          <q-input
            dense
            label="Kwota*"
            v-model="amount"
            autofocus/>
          <div class="q-gutter-sm">
            <q-radio v-model="typeAmount" val="net" label="netto" />
            <q-radio v-model="typeAmount" val="gross" label="brutto" />
          </div>
        </div>
        <div class="col-6">
          <q-select filled v-model="rate" :options="vatValues" label="Stawka podatku VAT" />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <q-btn color="primary" label="Oblicz" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
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
  }
}
</script>
