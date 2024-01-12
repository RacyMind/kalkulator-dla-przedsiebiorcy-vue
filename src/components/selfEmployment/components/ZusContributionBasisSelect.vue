<template>
  <q-select
    v-model.number="chosenContributionBasis"
    :disable="props.disabled"
    :options="contributionBasisOptions"
    label="Podstawa składek ZUS"
    color="brand"
    required
    emit-value
    map-options
  />
</template>

<script setup lang="ts">
import {ContributionBasises} from 'src/composables/contributionBasises'
import {computed} from 'vue'

interface Props {
  modelValue: ContributionBasises
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const emit = defineEmits(['update:modelValue'])

const chosenContributionBasis = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const contributionBasisOptions = [
  {
    label: 'Duży ZUS',
    value: ContributionBasises.Big,
  },
  {
    label: 'Mały ZUS',
    value: ContributionBasises.Small,
  },
  {
    label: 'Własna podstawa',
    value: ContributionBasises.Custom,
  },
]
</script>
