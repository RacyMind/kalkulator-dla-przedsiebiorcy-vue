<template>
  <q-select
    v-model.number="year"
    @update:model-value="changeYear"
    :options="years"
    label="Wybierz rok podatkowy*"
    color="brand"
    emit-value
    required
  />
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useConstantsStore} from 'stores/constantsStore'
const constants = useConstantsStore()

interface Props {
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const year = ref(props.modelValue)
const years = constants.AVAILABLE_YEARS

watch(() => props.modelValue, () => {
  year.value = props.modelValue
})

const changeYear = () => {
  emit('update:modelValue', year.value)
}
</script>
