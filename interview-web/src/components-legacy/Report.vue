<template>
  <div v-if="!feedbackData" class="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-orange-100 p-4">
    <p class="text-xl text-gray-700 font-inter">正在生成报告...</p>
  </div>
  <div v-else class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-red-100 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl text-center">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-6 font-inter">面试评测报告</h1>
      <p class="text-xl text-gray-600 mb-8 font-inter">
        领域: <span class="font-semibold text-red-600">{{ selectedDomainName }}</span> - 岗位: <span class="font-semibold text-red-600">{{ selectedRole }}</span>
      </p>

      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-700 mb-4 font-inter flex items-center justify-center">
          <ChartRadarIcon class="mr-2 text-red-500" />
          能力雷达图
        </h2>
        <RadarChart :scores="radarChartScores" :labels="radarChartLabels" :max-score="100" />
      </div>

      <div class="mb-8 text-left">
        <h2 class="text-3xl font-bold text-gray-700 mb-4 font-inter">关键问题定位</h2>
        <ul class="list-disc list-inside text-lg text-gray-700 space-y-2">
          <li v-for="(issue, index) in feedbackData.keyIssues" :key="index" class="font-inter">{{ issue }}</li>
        </ul>
      </div>

      <div class="mb-8 text-left">
        <h2 class="text-3xl font-bold text-gray-700 mb-4 font-inter">改进建议</h2>
        <ul class="list-disc list-inside text-lg text-gray-700 space-y-2">
          <li v-for="(suggestion, index) in feedbackData.improvementSuggestions" :key="index" class="font-inter">{{ suggestion }}</li>
        </ul>
      </div>

      <button
        @click="emits('view-recommendations')"
        class="bg-blue-600 text-white py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-inter text-xl mr-4"
      >
        <BookOpenIcon class="inline-block mr-2" />
        查看学习推荐
      </button>
      <button
        @click="emits('go-home')"
        class="bg-gray-400 text-white py-4 px-8 rounded-full shadow hover:bg-gray-500 transition-all duration-300 font-inter text-xl"
      >
        <HomeIcon class="inline-block mr-2" />
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import RadarChart from './RadarChart.vue'; // 导入雷达图组件
import { ChartRadarIcon, BookOpenIcon, HomeIcon } from './Icons.js'; // 导入图标组件

const props = defineProps({
  feedbackData: Object,
  selectedDomainName: String,
  selectedRole: String,
  radarChartScores: Array,
  radarChartLabels: Array,
});

const emits = defineEmits(['view-recommendations', 'go-home']);
</script>

<style scoped>
/* Report.vue 专属样式 */
</style>