<template>
  <svg :width="size" :height="size" class="mx-auto my-4">
    <polygon v-for="(points, i) in gridLines" :key="'grid-' + i" :points="points" fill="none" stroke="#e0e0e0" stroke-width="1" />
    <line v-for="(axis, i) in axes" :key="'axis-' + i" :x1="axis.x1" :y1="axis.y1" :x2="axis.x2" :y2="axis.y2" stroke="#ccc" stroke-width="1" />
    <polygon :points="polygonPoints" fill="rgba(76, 175, 80, 0.6)" stroke="#4CAF50" stroke-width="2" />
    <text v-for="(label, i) in textLabels" :key="'label-' + i" :x="label.x" :y="label.y" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#333" class="font-inter">
      {{ label.text }}
    </text>
  </svg>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps(['scores', 'labels', 'maxScore']);

const size = 300;
const center = size / 2;
const radius = size / 2 - 30;
const numPoints = computed(() => props.labels.length);
const angleStep = computed(() => (2 * Math.PI) / numPoints.value);

const getPoint = (score, index) => {
  const angle = index * angleStep.value - Math.PI / 2;
  const r = (score / props.maxScore) * radius;
  const x = center + r * Math.cos(angle);
  const y = center + r * Math.sin(angle);
  return `${x},${y}`;
};

const polygonPoints = computed(() => props.scores.map((score, i) => getPoint(score, i)).join(' '));

const gridLines = computed(() => {
  return [0.2, 0.4, 0.6, 0.8, 1.0].map(level => {
    const currentRadius = radius * level;
    return Array.from({ length: numPoints.value }).map((_, idx) => {
      const angle = idx * angleStep.value - Math.PI / 2;
      const x = center + currentRadius * Math.cos(angle);
      const y = center + currentRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });
});

const axes = computed(() => {
  return props.labels.map((_, i) => {
    const angle = i * angleStep.value - Math.PI / 2;
    return {
      x1: center,
      y1: center,
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });
});

const textLabels = computed(() => {
  return props.labels.map((label, i) => {
    const angle = i * angleStep.value - Math.PI / 2;
    return {
      x: center + (radius + 20) * Math.cos(angle),
      y: center + (radius + 20) * Math.sin(angle),
      text: label,
    };
  });
});
</script>

<style scoped>
/* RadarChart.vue 专属样式 */
</style>