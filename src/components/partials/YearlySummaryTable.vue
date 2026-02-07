<template>
  <q-card
    class="relative-position"
    style="width: auto; max-width: 98vw;">
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
      <template v-slot:body-cell-month="props">
        <q-td
          :props="props"
          :class="(props.rowIndex === constants.LOCALE_DATE.wholeYearIndex) ? 'bg-primary text-white' : 'bg-white text-black'"
        >
          {{ monthLabels[props.rowIndex] }}
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
              <div
                v-if="col.name === 'month'"
                class="text-bold"
                :class="{'text-primary': props.rowIndex !== constants.LOCALE_DATE.wholeYearIndex}"
              >
                {{ monthLabels[props.rowIndex] }}
              </div>
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
              <div
                class="row justify-between"
                style="font-size: 13px;"
              >
                <div>
                  <template v-if="col.label">
                    {{ col.label.replace('Skł.', 'Składka') }}
                    <q-icon
                      v-if="col.name === 'gross'"
                      class="text-primary"
                      name="edit" />
                  </template>
                </div>
                <div>
                  {{ col.value }}
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useConstantsStore} from 'stores/constantsStore'
const constants = useConstantsStore()

interface Props {
  columns: any[]
  rows: Array<Record<string, unknown>>
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})
const emit = defineEmits<{
  grossAmountUpdated: [grossAmounts: number[]]
}>()

const monthLabels = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
  'Cały rok',
]

const editableRows = ref<Array<Record<string, unknown>>>([])

watch(() => props.rows, (newVal) => {
    editableRows.value = JSON.parse(JSON.stringify(newVal))
  },
  {
    immediate: true,
  },
)

watch(editableRows, () => {
    const grossAmounts = editableRows.value.filter((_row, index) => index !== constants.LOCALE_DATE.wholeYearIndex).map((row: any) => row.grossAmount)
    emit('grossAmountUpdated', grossAmounts)
  },
  {
    deep: true,
  },
)
</script>
