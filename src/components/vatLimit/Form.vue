<template>
  <q-form
    @validation-error="handleValidationError"
    @submit.prevent="save">
    <FormSection title="Data rozpoczęcia">
      <q-input
        v-model="startDate"
        color="brand"
        mask="##.##.####"
        label="Data rozpoczęcia działalności"
        :rules="[validationRules.required]"
        lazy-rules="ondemand"
        hide-bottom-space>
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer">
          </q-icon>
        </template>
        <DatePopup v-model="startDate" />
      </q-input>
    </FormSection>
    <SubmitButton />
  </q-form>
</template>

<script lang="ts">
import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {computed, defineComponent, ref} from 'vue'
import {format, parse} from 'date-fns'
import {useFormValidation} from 'src/composables/formValidation'
import DatePopup from 'components/partials/DatePopup.vue'
import FormSection from 'components/partials/form/FormSection.vue'
import SubmitButton from 'components/partials/form/SubmitButton.vue'
import validationRules from 'src/logic/validationRules'

export default defineComponent({
  components: {
    DatePopup,
    FormSection,
    SubmitButton,
  },
  setup(props, context) {
    const {handleValidationError} = useFormValidation()
    const startDate = ref(format(new Date(), 'dd.MM.yyyy'))

    const isDisabledButton = computed(() => {
      return !startDate.value
    })

    const save = () => {
      const input: VatLimitInputFields = {
        startDate: parse(
          startDate.value,
          'dd.MM.yyyy',
          new Date(),
        ),
      }
      context.emit('save', input)
    }

    return {
      handleValidationError,
      isDisabledButton,
      save,
      startDate,
      validationRules,
    }
  },
})
</script>
