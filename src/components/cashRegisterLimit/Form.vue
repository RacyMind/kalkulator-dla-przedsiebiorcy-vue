<template>
  <q-form @submit.prevent="save">
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="startDate"
          color="brand"
          mask="##.##.####"
          label="Data rozpoczęcia sprzedaży*"
          :rules="[validationRules.required]"
          lazy-rules>
          <template v-slot:append>
            <q-icon
              name="event"
              class="cursor-pointer">
            </q-icon>
          </template>
          <DatePopup v-model="startDate" />
        </q-input>
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width"
          color="brand"
          size="lg"
          label="Oblicz"
          :disable="isDisabledButton"
        />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {computed, defineComponent, ref} from 'vue'
import {format, parse} from 'date-fns'
import DatePopup from 'components/partials/DatePopup.vue'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  components: {
    DatePopup,
  },
  setup(props, context) {
    const startDate = ref(format(new Date(), 'dd.MM.yyyy'))

    const isDisabledButton = computed(() => {
      return !startDate.value
    })

    const save = () => {
      const input: CashRegisterLimitInputFields = {
        startDate: parse(
          startDate.value,
          'dd.MM.yyyy',
          new Date(),
        ),
      }
      context.emit('save', input)
    }

    return {
      isDisabledButton,
      save,
      startDate,
      validationRules,
    }
  },
})
</script>
