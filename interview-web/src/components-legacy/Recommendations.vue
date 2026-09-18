<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl text-center">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-6 font-inter">个性化学习推荐</h1>
      <p class="text-xl text-gray-600 mb-8 font-inter">
        根据您的评测结果，为您推荐以下学习资源：
      </p>

      <div v-if="Object.keys(learningRecs).length > 0">
        <div v-for="(items, category) in learningRecs" :key="category" class="mb-8 p-6 bg-indigo-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-left">
          <h2 class="text-2xl font-semibold text-indigo-700 mb-4 font-inter">
            {{ categoryLabels[category] }} 提升
          </h2>
          <ul class="list-disc list-inside text-lg text-gray-700 space-y-2">
            <li v-for="(item, index) in items" :key="index" class="font-inter">
              <a :href="item.link" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                {{ item.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p v-else class="text-lg text-gray-700 font-inter">暂无推荐资源。</p>

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
import { categoryLabels } from '../utils/mockData';
import { HomeIcon } from './Icons.js'; // 导入图标组件

const props = defineProps({
  learningRecs: Object,
  categoryLabels: Object,
});

const emits = defineEmits(['go-home']);
</script>

<style scoped>
/* Recommendations.vue 专属样式 */
</style>