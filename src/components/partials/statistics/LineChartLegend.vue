<template>
  <ul
    v-if="legendItems.length"
    class="line-chart-legend"
    data-test="line-legend"
  >
    <li
      v-for="item in legendItems"
      :key="item.key"
      class="line-chart-legend__item"
      data-test="line-legend-item"
    >
      <span
        class="line-chart-legend__swatch"
        :style="{ backgroundColor: item.color }"
        aria-hidden="true"
      />

      <div class="line-chart-legend__content">
        <div class="line-chart-legend__header">
          <span class="line-chart-legend__label">{{ item.label }}</span>
          <span class="line-chart-legend__value" data-test="line-legend-value">
            {{ item.valueLabel }}
          </span>
        </div>

        <div class="line-chart-legend__track" aria-hidden="true">
          <span
            class="line-chart-legend__fill"
            :style="{
              width: item.width,
              backgroundColor: item.color,
            }"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LegendItem {
  label: string
  color: string
  value: number
  valueLabel: string
}

interface NormalizedLegendItem extends LegendItem {
  key: string
  width: string
}

interface Props {
  items: LegendItem[]
}

const props = defineProps<Props>()

const legendItems = computed<NormalizedLegendItem[]>(() => {
  const maxValue = Math.max(
    ...props.items.map((item) => Math.abs(item.value)),
    0,
  )

  return props.items.map((item, index) => ({
    ...item,
    key: `${item.label}-${index}`,
    width: `${maxValue > 0 ? (Math.abs(item.value) / maxValue) * 100 : 0}%`,
  }))
})
</script>

<style lang="scss" scoped>
.line-chart-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.line-chart-legend__item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.line-chart-legend__swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  margin-top: 4px;
  flex: 0 0 12px;
}

.line-chart-legend__content {
  flex: 1;
  min-width: 0;
}

.line-chart-legend__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.line-chart-legend__label {
  font-size: 0.9rem;
  line-height: 1.25rem;
}

.line-chart-legend__value {
  text-align: right;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--q-primary);
}

.line-chart-legend__track {
  width: 100%;
  height: 6px;
  margin-top: 4px;
  background: rgba(128, 128, 128, 0.22);
  border-radius: 999px;
  overflow: hidden;
}

.line-chart-legend__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 220ms ease;
}
</style>
