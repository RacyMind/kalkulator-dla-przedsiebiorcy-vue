<template>
  <div class="q-mt-md">
    <div class="row">
      <div class="col-12">
        <q-btn
          type="submit"
          class="full-width submit-btn"
          color="primary"
          size="lg"
          label="Oblicz"
          unelevated
          style="border-radius: var(--radius-md)"
          @click="handleSubmit"
        />
      </div>
    </div>
    <div
      class="full-width q-pa-sm text-caption"
      style="color: var(--color-text-secondary)"
    >
      <p class="q-mb-none">
        Korzystając z aplikacji akceptujesz
        <router-link style="color: var(--color-text-primary)" to="/regulamin">
          regulamin
        </router-link>
        oraz
        <router-link
          style="color: var(--color-text-primary)"
          to="/polityka-prywatnosci"
        >
          politykę prywatności
        </router-link>
        .
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEventStore } from 'stores/eventStore'
import { useRoute } from 'vue-router'
import ga from 'src/logic/analytics'
import { AnalyticsEventName } from 'src/types/Analytics'

const eventStore = useEventStore()
const route = useRoute()

const resolveCalculatorSlug = (path: string): string => {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '')
  if (normalizedPath.length === 0) {
    return 'home'
  }

  return normalizedPath.replace(/\//g, '-')
}

const handleSubmit = () => {
  eventStore.$reset()
  ga.logEvent(AnalyticsEventName.CalculationSubmit, {
    calculator_slug: resolveCalculatorSlug(route.path),
  })
}
</script>
