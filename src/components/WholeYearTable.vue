<template>
  <q-card
    class="relative-position"
    style="width: auto; max-width: 90vw;">
    <q-btn
      icon="close"
      class="absolute-top-right z-top"
      flat
      round
      dense
      v-close-popup />
    <q-table
      :title="title"
      :grid="$q.screen.xs || $q.screen.sm"
      :rows="editableRows"
      :columns="columns"
      hide-bottom
      :pagination="{rowsPerPage: 13}">
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="(props.rowIndex === constants.LOCALE_DATE.wholeYearIndex) ? 'bg-primary text-white' : 'bg-white text-black'"
        >
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-gross="props">
        <q-td
          :props="props"
          :class="(props.rowIndex === constants.LOCALE_DATE.wholeYearIndex) ? 'bg-primary text-white' : 'bg-white text-black'"
        >
          <q-popup-edit
            v-if="props.rowIndex !== constants.LOCALE_DATE.wholeYearIndex"
            v-model.number="props.row.grossAmount">
            <q-input
              v-model.number="props.row.grossAmount"
              type="number"
              min="0"
              step="0.01"
              suffix="zł"
              color="brand"
              :rules="[
                val => !!val || '* Wpisz kwotę',
              ]"
              lazy-rule/>
          </q-popup-edit>
          {{ props.value }}
          <q-icon
            class="text-primary"
            name="edit" />
        </q-td>
      </template>
      <template v-slot:item="props">
        <div
          class="full-width q-table__grid-item">
          <q-card
            class="q-table__grid-item-card q-table__card">
            <div
              v-for="col in props.cols"
              :key="col.name"
              class="q-table__grid-item-row">
              <q-popup-edit
                v-if="col.name === 'gross'"
                v-model.number="props.row.grossAmount">
                <q-input
                  v-model.number="props.row.grossAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  suffix="zł"
                  color="brand"
                  :rules="[
                    val => !!val || '* Wpisz kwotę',
                  ]"
                  lazy-rule/>
              </q-popup-edit>
              <div class="q-table__grid-item-title">
                {{ col.label }}
              </div>
              <div class="q-table__grid-item-value">
                {{ col.value }}
                <q-icon
                  v-if="col.name === 'gross'"
                  class="text-primary"
                  name="edit" />
              </div>
            </div>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script>
import constants from 'src/logic/constants'
export default {
  setup () {
    return {
      constants,
    }
  },
  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
  data () {
    return {
      editableRows: [],
    }
  },
  watch: {
    rows: {
      handler: function () {
        this.editableRows = JSON.parse(JSON.stringify(this.rows))
      },
      immediate: true,
    },
    editableRows: {
      handler: function () {
        const grossAmounts = this.editableRows.filter((row, index) => index !== constants.LOCALE_DATE.wholeYearIndex).map(row => row.grossAmount)
        this.$emit('grossAmountUpdated', grossAmounts)
      },
      deep: true,
    },
  },

}
</script>
