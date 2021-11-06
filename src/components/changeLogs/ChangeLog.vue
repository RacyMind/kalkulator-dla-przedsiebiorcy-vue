<template>
  <q-card
    class="c-logCard"
    flat>
    <q-card-section>
      <p>
        <b>Wersja:</b> {{log.version}}<br>
        <b>Data publikacji:</b> {{log.publish_date}}
      </p>
      <div v-html="log.content"></div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: ['log'],
}
</script>
<style>
  #q-app .c-logCard ul{
    margin-bottom: 0;
  }
</style>
