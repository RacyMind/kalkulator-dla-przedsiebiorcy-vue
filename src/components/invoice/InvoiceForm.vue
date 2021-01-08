<template>
  <q-form>
      <div class="row justify-between">
        <div class="col-6 q-pr-sm">
          <q-input
            v-model="amount"
            label="Kwota*"
            autofocus
            color="brand"
          />
          <div class="q-gutter-sm">
            <q-radio
              v-model="typeAmount"
              val="net"
              label="netto"
              color="brand"
            />
            <q-radio
              v-model="typeAmount"
              val="gross"
              label="brutto"
              color="brand"
            />
          </div>
        </div>
        <div class="col-6 q-pl-sm">
          <q-select
            v-model="rate"
            :options="vatValues"
            label="Stawka podatku VAT*"
            color="brand"
          />
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="col-12">
          <q-btn
            class="full-width"
            color="brand"
            size="lg"
            label="Oblicz"
          />
        </div>
      </div>
  </q-form>
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

<style scoped>

</style>
