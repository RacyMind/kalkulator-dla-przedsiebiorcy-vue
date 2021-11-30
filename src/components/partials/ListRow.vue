<template>
  <div class="row justify-between q-px-md q-py-sm">
    <div>
      {{ name }}
    </div>
    <div>
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'value'],
}
</script>
