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
          <li v-for="(issue, index) in paginatedKeyIssues" :key="index" class="font-inter">{{ issue }}</li>
        </ul>
        
        <!-- 关键问题分页 -->
        <Pagination
          v-if="feedbackData.keyIssues && feedbackData.keyIssues.length > issuesPageSize"
          :current-page="issuesCurrentPage"
          :total-items="feedbackData.keyIssues.length"
          :page-size="issuesPageSize"
          @page-change="handleIssuesPageChange"
          @page-size-change="handleIssuesPageSizeChange"
        />
      </div>

      <div class="mb-8 text-left">
        <h2 class="text-3xl font-bold text-gray-700 mb-4 font-inter">改进建议</h2>
        <ul class="list-disc list-inside text-lg text-gray-700 space-y-2">
          <li v-for="(suggestion, index) in paginatedSuggestions" :key="index" class="font-inter">{{ suggestion }}</li>
        </ul>
        
        <!-- 改进建议分页 -->
        <Pagination
          v-if="feedbackData.improvementSuggestions && feedbackData.improvementSuggestions.length > suggestionsPageSize"
          :current-page="suggestionsCurrentPage"
          :total-items="feedbackData.improvementSuggestions.length"
          :page-size="suggestionsPageSize"
          @page-change="handleSuggestionsPageChange"
          @page-size-change="handleSuggestionsPageSizeChange"
        />
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
import { defineProps, defineEmits, onMounted, watch, ref, computed } from 'vue';
import RadarChart from './RadarChart.vue'; // 导入雷达图组件
import { ChartRadarIcon, BookOpenIcon, HomeIcon } from './Icons.js'; // 导入图标组件
import Pagination from './Pagination.vue';

const props = defineProps({
  feedbackData: Object,
  selectedDomainName: String,
  selectedRole: String,
  radarChartScores: Array,
  radarChartLabels: Array,
});

const emits = defineEmits(['view-recommendations', 'go-home']);

// 分页相关数据
const issuesCurrentPage = ref(1);
const issuesPageSize = ref(5);
const suggestionsCurrentPage = ref(1);
const suggestionsPageSize = ref(5);

// 计算分页后的关键问题
const paginatedKeyIssues = computed(() => {
  if (!props.feedbackData?.keyIssues) return [];
  const start = (issuesCurrentPage.value - 1) * issuesPageSize.value;
  const end = start + issuesPageSize.value;
  return props.feedbackData.keyIssues.slice(start, end);
});

// 计算分页后的改进建议
const paginatedSuggestions = computed(() => {
  if (!props.feedbackData?.improvementSuggestions) return [];
  const start = (suggestionsCurrentPage.value - 1) * suggestionsPageSize.value;
  const end = start + suggestionsPageSize.value;
  return props.feedbackData.improvementSuggestions.slice(start, end);
});

// 处理关键问题分页变化
const handleIssuesPageChange = (page) => {
  issuesCurrentPage.value = page;
};

const handleIssuesPageSizeChange = (size) => {
  issuesPageSize.value = size;
  issuesCurrentPage.value = 1;
};

// 处理改进建议分页变化
const handleSuggestionsPageChange = (page) => {
  suggestionsCurrentPage.value = page;
};

const handleSuggestionsPageSizeChange = (size) => {
  suggestionsPageSize.value = size;
  suggestionsCurrentPage.value = 1;
};

// 添加调试信息
onMounted(() => {
  console.log('Report组件已挂载');
  console.log('接收到的props:', {
    feedbackData: props.feedbackData,
    selectedDomainName: props.selectedDomainName,
    selectedRole: props.selectedRole,
    radarChartScores: props.radarChartScores,
    radarChartLabels: props.radarChartLabels
  });
  
  // 检查数据是否有效
  if (props.feedbackData) {
    console.log('feedbackData存在，包含:', {
      keyIssues: props.feedbackData.keyIssues?.length || 0,
      improvementSuggestions: props.feedbackData.improvementSuggestions?.length || 0
    });
  } else {
    console.warn('feedbackData不存在或为空');
  }
  
  if (props.radarChartScores) {
    console.log('radarChartScores存在，分数:', props.radarChartScores);
  } else {
    console.warn('radarChartScores不存在或为空');
  }
});

// 监听props变化
watch(() => props.feedbackData, (newData) => {
  console.log('feedbackData发生变化:', newData);
}, { deep: true });

watch(() => props.radarChartScores, (newScores) => {
  console.log('radarChartScores发生变化:', newScores);
}, { deep: true });

// 计算属性：检查数据是否完整
const isDataComplete = () => {
  return props.feedbackData && 
         props.feedbackData.keyIssues && 
         props.feedbackData.improvementSuggestions &&
         props.radarChartScores &&
         props.radarChartScores.length > 0;
};

// 导出调试信息到全局
if (typeof window !== 'undefined') {
  window.reportDebug = {
    props,
    isDataComplete: isDataComplete()
  };
}
</script>

<style scoped>
/* Report.vue 专属样式 */
</style>