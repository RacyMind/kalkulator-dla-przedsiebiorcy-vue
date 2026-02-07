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

<script setup lang="ts">
interface LogEntry {
  version: string
  publish_date: string
  content: string
}

interface Props {
  log: LogEntry
}

defineProps<Props>()
</script>

<style>
  #q-app .c-logCard ul{
    margin-bottom: 0;
  }
</style>
