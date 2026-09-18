<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center">
      <h1 class="text-5xl font-extrabold text-gray-800 mb-6 font-inter">AI 模拟面试官</h1>
      <p class="text-lg text-gray-600 mb-8 font-inter">助您提升面试能力，成就职业梦想！</p>

      <h2 class="text-3xl font-bold text-gray-700 mb-6 font-inter">选择面试领域与岗位</h2>
      <div v-for="domain in mockInterviewDomains" :key="domain.id" class="mb-8 p-6 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <h3 class="text-2xl font-semibold text-blue-700 mb-4 font-inter">{{ domain.name }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="role in domain.roles"
            :key="role"
            @click="handleStartInterview(domain.id, role)"
            class="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-inter text-lg"
          >
            {{ role }}
          </button>
        </div>
      </div>
      <div class="mt-8 text-gray-500 text-sm font-inter">
        当前用户ID: {{ userId || '加载中...' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { mockInterviewDomains } from '../utils/mockData';

const props = defineProps({
  userId: String,
});

const emits = defineEmits(['start-interview']);

const handleStartInterview = (domainId, role) => {
  emits('start-interview', domainId, role);
};
</script>

<style scoped>
/* Home.vue 专属样式 */
</style>