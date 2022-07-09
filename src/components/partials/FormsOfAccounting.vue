<template>
  <div>
    <q-select
      v-model="type"
      @update:model-value="changed"
      :options="availableTypes"
      label="Forma rozliczenia*"
      color="brand"
      required
    />
  </div>
</template>

<script>
import constants from 'src/logic/constants'
export default {
  data () {
    return {
      availableTypes: [
        {
          label: 'Umowa o pracę',
          value: constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.CONTRACT_OF_EMPLOYMENT,
        },
        {
          label: 'Samozatrudnienie',
          value: constants.AVAILABLE_FORMS_OF_ACCOUNTING_FOR_MARIAGE.SELF_EMPLOYMENT,
        },
      ],
      type: null,
    }
  },
  methods: {
    changed () {
      this.$emit('update:modelValue', this.type)
    },
  },
  props: ['modelValue'],
  watch: {
    modelValue: {
      handler: function () {
        this.type = this.modelValue
      },
      immediate: true,
    },
  },
}
</script>
