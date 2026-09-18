<template>
  <div style="text-align: center">
    <!-- 移动端导航 -->
    <MobileNavigation 
      v-if="isMobile && isLoggedIn"
      :current-user="currentUser"
      :current-page="currentPage"
      @navigate="handleMobileNavigate"
      @logout="handleMobileLogout"
    />
    
    <!-- 调试信息 (仅桌面端) -->
    <div v-if="currentPage !== 'home' && isLoggedIn && !isMobile" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; z-index: 1000; font-size: 12px;">
      当前页面: {{ currentPage }}
    </div>
    
    <!-- 用户信息显示 (仅桌面端) -->
    <div v-if="isLoggedIn && currentPage === 'home' && !isMobile" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; z-index: 1000; font-size: 12px;">
      欢迎，{{ currentUser?.username || '用户' }}
      <button @click="handleLogout" style="margin-left: 10px; padding: 2px 8px; background: #ff4d4f; border: none; border-radius: 3px; color: white; cursor: pointer; font-size: 10px;">
        退出
      </button>
    </div>
    
    <a-space style="padding: 20px" direction="vertical">
      </a-space>

    <!-- 登录页面 -->
    <Login v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    
    <!-- 主应用内容 -->
    <div v-else>
      <!-- 移动端主页 -->
      <MobileHome 
        v-if="currentPage === 'home' && isMobile" 
        @start-interview="handleStartInterview" 
        @test-analysis="currentPage = 'test'" 
        @camera-test="currentPage = 'camera-test'" 
        @conversation-test="currentPage = 'conversation-test'" 
        @navigate-to-page="handleNavigateToPage"
        :user-id="userId"
        :activities="activities"
      />
      
      <!-- 桌面端主页 -->
      <Home 
        v-else-if="currentPage === 'home' && !isMobile" 
        @start-interview="handleStartInterview" 
        @test-analysis="currentPage = 'test'" 
        @camera-test="currentPage = 'camera-test'" 
        @fullscreen-camera-test="currentPage = 'fullscreen-camera-test'" 
        @conversation-test="currentPage = 'conversation-test'"
        @navigate-to-page="handleNavigateToPage" 
        :user-id="userId" 
      />
      
      <!-- 面试记录页面 -->
      <InterviewRecords
        v-else-if="currentPage === 'interview-records'"
        :is-mobile="isMobile"
        @go-back="() => currentPage = 'home'"
      />
      
      <!-- 能力分析页面 -->
      <AbilityAnalysis
        v-else-if="currentPage === 'ability-analysis'"
        :is-mobile="isMobile"
        @go-back="() => currentPage = 'home'"
      />
      
      <!-- 设置页面 -->
      <Settings
        v-else-if="currentPage === 'settings'"
        :is-mobile="isMobile"
        @go-back="() => currentPage = 'home'"
      />
      <!-- 面试页面 -->
      <RealtimeInterview
        v-else-if="currentPage === 'interview'"
        :selected-domain-name="selectedDomainName"
        :selected-role="selectedRole"
        :is-mobile="isMobile"
        @go-home="handleGoHome"
        @analysis-complete="handleAnalysisComplete"
      />
      
      <!-- 报告页面 -->
      <Report
        v-else-if="currentPage === 'report'"
        :feedback-data="feedbackData"
        :selected-domain-name="selectedDomainName"
        :selected-role="selectedRole"
        :radar-chart-scores="radarChartScores"
        :radar-chart-labels="radarChartLabels"
        :is-mobile="isMobile"
        @view-recommendations="currentPage = 'recommendations'"
        @go-home="handleGoHome"
      />
      
      <!-- 推荐页面 -->
      <Recommendations
        v-else-if="currentPage === 'recommendations'"
        :learning-recs="learningRecs"
        :category-labels="categoryLabels"
        :is-mobile="isMobile"
        @go-home="handleGoHome"
      />
      
      <!-- 测试页面 -->
      <TestAnalysis
        v-else-if="currentPage === 'test'"
        :is-mobile="isMobile"
        @go-back="currentPage = 'home'"
      />
      
      <CameraTest
        v-else-if="currentPage === 'camera-test'"
        :is-mobile="isMobile"
        @go-back="currentPage = 'home'"
      />
      
      <FullscreenCameraTest
        v-else-if="currentPage === 'fullscreen-camera-test' && !isMobile"
        @go-back="currentPage = 'home'"
      />
      
      <ConversationTest
        v-else-if="currentPage === 'conversation-test'"
        :is-mobile="isMobile"
        @go-back="currentPage = 'home'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { onAuthStateChanged } from 'firebase/auth';

// Import child components
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import MobileHome from './components/MobileHome.vue';
import MobileNavigation from './components/MobileNavigation.vue';
import RealtimeInterview from './components/RealtimeInterview.vue';
import Report from './components/Report.vue';
import Recommendations from './components/Recommendations.vue';
import TestAnalysis from './components/TestAnalysis.vue';
import CameraTest from './components/CameraTest.vue';
import FullscreenCameraTest from './components/FullscreenCameraTest.vue';
import ConversationTest from './components/ConversationTest.vue';
import InterviewRecords from './components/InterviewRecords.vue';
import AbilityAnalysis from './components/AbilityAnalysis.vue';
import Settings from './components/Settings.vue';

// Import mock data and utility functions
import {
  mockInterviewDomains,
  mockFeedbackReport,
  mockLearningRecommendations,
  categoryLabels,
  radarChartLabels,
  simulateApiCall,
} from './utils/mockData';
import { initializeFirebase, signInAnonymouslyToFirebase, addInterviewHistory } from './utils/realtimeService';

// Global responsive state
const currentPage = ref('home');
const selectedDomain = ref(null);
const selectedRole = ref(null);
const interviewHistory = ref([]);
const isLoading = ref(false);
const feedbackData = ref(null);
const learningRecs = ref([]);
const userId = ref(null);
const dbInstance = ref(null);
const authInstance = ref(null);
const isAuthReady = ref(false);

// 登录状态管理
const isLoggedIn = ref(false);
const currentUser = ref(null);

// 移动端检测
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
const handleResize = () => {
  checkMobile();
};

// 模拟活动数据（用于移动端主页）
const activities = ref([
  { id: 1, icon: '💼', text: '完成了技术面试', time: '2小时前' },
  { id: 2, icon: '📊', text: '查看了分析报告', time: '4小时前' },
  { id: 3, icon: '🎯', text: '开始了HR面试', time: '1天前' },
  { id: 4, icon: '📈', text: '提升了面试技能', time: '2天前' },
  { id: 5, icon: '🏆', text: '获得了优秀评分', time: '3天前' },
  { id: 6, icon: '📝', text: '上传了新简历', time: '5天前' },
  { id: 7, icon: '💡', text: '学习了面试技巧', time: '1周前' },
  { id: 8, icon: '🔍', text: '分析了面试表现', time: '1周前' }
]);

// 检查本地存储的登录状态
const checkLoginStatus = () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      currentUser.value = userData;
      userId.value = userData.userId;
      isLoggedIn.value = true;
    } catch (error) {
      console.error('解析用户数据失败:', error);
      localStorage.removeItem('currentUser');
    }
  }
};

// --- Computed Properties ---
const selectedDomainName = computed(() => mockInterviewDomains.find(d => d.id === selectedDomain.value)?.name);
const radarChartScores = ref([]);

// 更新雷达图分数的函数
const updateRadarChartScores = (scores) => {
  radarChartScores.value = scores;
};

// --- Methods ---
const handleStartInterview = (domainId, role) => {
  selectedDomain.value = domainId;
  selectedRole.value = role;
  interviewHistory.value = []; // Reset history for new interview
  currentPage.value = 'interview';
};

// 处理分析完成的事件
const handleAnalysisComplete = async (analysisResult) => {
  try {
    isLoading.value = true;
    
    console.log('收到分析结果:', analysisResult);
    console.log('当前页面:', currentPage.value);
    
    // 从分析结果中提取数据，添加安全检查
    const feedback = analysisResult?.feedbackData || {};
    const scores = analysisResult?.radarChartScores || [];
    const recommendations = analysisResult?.learningRecommendations || {};
    
    console.log('提取的数据:', { feedback, scores, recommendations });
    
    // 更新状态
    feedbackData.value = feedback;
    learningRecs.value = recommendations;
    updateRadarChartScores(scores);
    
    console.log('状态更新完成:', {
      feedbackData: feedbackData.value,
      learningRecs: learningRecs.value,
      radarChartScores: radarChartScores.value
    });
    
    // 保存面试记录到Firebase（如果可用）
    if (isAuthReady.value && dbInstance.value && userId.value) {
      try {
        await addInterviewHistory(dbInstance.value, 'interview-app', userId.value, {
          domain: selectedDomain.value,
          role: selectedRole.value,
          timestamp: new Date().toISOString(),
          feedback,
          scores,
          recommendations
        });
      } catch (error) {
        console.warn('保存面试记录失败:', error);
      }
    }
    
    // 跳转到报告页面
    console.log('准备跳转到报告页面，当前页面:', currentPage.value);
    
    // 强制跳转 - 使用nextTick确保DOM更新
    await nextTick();
    currentPage.value = 'report';
    
    console.log('跳转后页面:', currentPage.value);
    
    // 添加延迟确认跳转
    setTimeout(() => {
      console.log('延迟确认当前页面:', currentPage.value);
      if (currentPage.value !== 'report') {
        console.warn('页面跳转失败，强制设置页面为report');
        currentPage.value = 'report';
      }
    }, 100);
    
    // 再次确认跳转
    setTimeout(() => {
      console.log('最终确认当前页面:', currentPage.value);
    }, 500);
    
  } catch (error) {
    console.error('处理分析结果失败:', error);
    message.error('处理分析结果失败：' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleGoHome = () => {
  currentPage.value = 'home';
  selectedDomain.value = null;
  selectedRole.value = null;
  interviewHistory.value = [];
  isLoading.value = false;
  feedbackData.value = null;
  learningRecs.value = [];
  radarChartScores.value = [];
};

// 处理登录成功
const handleLoginSuccess = (userData) => {
  currentUser.value = userData;
  userId.value = userData.userId;
  isLoggedIn.value = true;
  
  // 保存到本地存储
  localStorage.setItem('currentUser', JSON.stringify(userData));
  
  message.success(`欢迎${userData.isGuest ? '游客' : userData.username}！`);
};

// 处理退出登录
const handleLogout = () => {
  currentUser.value = null;
  userId.value = null;
  isLoggedIn.value = false;
  
  // 清除本地存储
  localStorage.removeItem('currentUser');
  
  // 重置应用状态
  handleGoHome();
  
  message.success('已退出登录');
};

// 移动端导航处理
const handleMobileNavigate = (page) => {
  currentPage.value = page;
};

// 移动端退出登录
const handleMobileLogout = () => {
  handleLogout();
};

// 处理页面导航
const handleNavigateToPage = (pageName) => {
  currentPage.value = pageName;
  console.log('导航到页面:', pageName);
};

onMounted(async () => {
  // 检查登录状态
  checkLoginStatus();
  
  // 初始化移动端检测
  checkMobile();
  window.addEventListener('resize', handleResize);
  
  // Firebase initialization and anonymous login
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.VUE_APP_FIREBASE_APP_ID || '',
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID || '',
  };
  
  try {
    const { auth, db } = initializeFirebase(firebaseConfig);
    authInstance.value = auth;
    dbInstance.value = db;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.value = user.uid;
        console.log("Firebase User ID:", userId.value);
        isAuthReady.value = true;
      } else {
        signInAnonymouslyToFirebase(auth).then(userCred => {
          userId.value = userCred.user.uid;
          console.log("Signed in anonymously:", userId.value);
          isAuthReady.value = true;
        }).catch(error => {
          console.error("Anonymous sign-in failed:", error);
          // 如果Firebase认证失败，使用本地随机ID
          userId.value = 'user_' + Math.random().toString(36).substr(2, 9);
          isAuthReady.value = true;
        });
      }
    });
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // 如果Firebase初始化失败，使用本地随机ID
    userId.value = 'user_' + Math.random().toString(36).substr(2, 9);
    isAuthReady.value = true;
  }
});

onUnmounted(() => {
  // networkManager.value?.destroy(); // Removed as networkManager is now in RealtimeInterview.vue
  // handleDisconnect(); // Removed as disconnection is handled by RealtimeInterview.vue
  window.removeEventListener('resize', handleResize);
});
</script>
<style>
/* Keep all global styles as they are, they will apply to RealtimeInterview.vue as well */
/* Using Tailwind, so minimal global styles are needed. */
/* The 'font-inter' class is used throughout the template, assuming Inter is loaded globally, e.g., in index.html */
.font-inter {
  font-family: 'Inter', sans-serif;
}

/* ========== 全局样式增强 ========== */
body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

/* 页面容器动画 */
div[class*="flex flex-col items-center"] {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 首页样式增强 ========== */
.bg-gradient-to-br.from-blue-100.to-purple-100 {
  background: linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%);
}

/* 领域卡片悬浮效果 */
.bg-blue-50 {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-left: 4px solid #3b82f6;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
  position: relative;
  overflow: hidden;
}

.bg-blue-50:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.25);
}

.bg-blue-50:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 1.5s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* 按钮发光效果 */
.bg-blue-600 {
    font-size: 24px;
    color: rgb(0, 0, 0);
    visibility: visible;
    font-family: zt3, sans-serif;
    box-sizing: border-box;
    outline: none;
    padding: 0px;
    margin: 0px;
    position: relative;
    box-shadow: rgba(176, 208, 221, 0.16) 0px 6px 8px 1px;
    float: left;
    /* margin-right: 40px; */
    width: calc(30% - 26.6667px);
    text-align: center;
    /* margin-bottom: 30px; */
    overflow: hidden;
    background: linear-gradient(rgba(116, 200, 223, 0.3) 0%, rgb(255, 255, 255) 100%);
    border-radius: 30px;
    border-width: 3px;
    border-style: solid;
    border-color: rgb(255, 255, 255);
    border-image: initial;
    height: 50px;
}

.bg-blue-600:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.6);
}

.bg-blue-600:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.bg-blue-600:hover:before {
  left: 100%;
}

/* ========== 面试页面样式增强 ========== */
.bg-gradient-to-br.from-green-100.to-teal-100 {
  background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
}

/* 问题卡片样式 */
.bg-gray-50 {
  background: linear-gradient(to bottom right, #f9fafb, #f0fdfa);
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  border-left: 4px solid #10b981;
  position: relative;
  padding: 1.5rem;
}

/* Video preview styles are now handled inside RealtimeInterview.vue's #local-player */
/*
video {
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 2px solid #e5e7eb;
  background: linear-gradient(45deg, #6ee7b7, #3b82f6);
  background-size: 400% 400%;
  animation: gradientBG 8s ease infinite;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
*/

/* 输入框聚焦效果 (Not directly used in RealtimeInterview but can be kept) */
textarea {
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #d1d5db;
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
  border-color: #10b981;
  outline: none;
}

/* 按钮组样式 */
.flex.space-x-4 {
  gap: 1rem;
}

/* ========== 报告页面样式增强 ========== */
.bg-gradient-to-br.from-orange-100.to-red-100 {
  background: linear-gradient(135deg, #ffedd5 0%, #fee2e2 100%);
}

/* .mb-6 {

  margin-top: 30vh;
} */
/* 雷达图容器 */
.mb-8 {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  width: 55%;
  margin-left: auto;
  margin-right: auto;

}

/* 关键问题定位和改进建议卡片 */
.text-left.bg-white {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  background: white;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.text-left.bg-white h2 {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  color: white;
  padding: 1rem 1.5rem;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  border-radius: 16px 16px 0 0;
  font-weight: 600;
}

/* ========== 推荐页面样式增强 ========== */
.bg-gradient-to-br.from-purple-100.to-indigo-100 {
  background: linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%);
}

/* 推荐卡片样式 */
.bg-indigo-50 {
  border-radius: 16px;
  transition: all 0.3s ease;
  border-left: 4px solid #8b5cf6;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.bg-indigo-50:hover {
  transform: translateX(10px);
  box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.2);
}

/* ========== 按钮通用样式增强 ========== */
button:not(:disabled) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  font-weight: 500;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
}

/* 主按钮特效 */
.bg-green-600 {
  background: linear-gradient(45deg, #10b981, #3b82f6);
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
  border: none;
}

.bg-green-600:hover {
  background-position: 100% 100%;
}

/* ========== 加载动画增强 ========== */
.animate-spin {
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ========== 雷达图修复 ========== */
/* 修复雷达图不显示的问题 */
svg {
  display: block;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

polygon {
  fill: rgba(76, 175, 80, 0.6);
  stroke: #4CAF50;
  stroke-width: 2;
  stroke-linejoin: round;
}

text {
  font-size: 14px;
  fill: #334155;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

circle {
  fill: #3b82f6;
}

/* ========== 响应式调整 ========== */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-1.md\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .flex.space-x-4 {
    flex-direction: column;
    gap: 12px;
  }
  
  button {
    width: 100%;
  }
  
  .text-4xl {
    font-size: 1.75rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  video {
    max-width: 100%;
  }
}

/* ========== 卡片标题样式 ========== */
h2.text-3xl.font-bold {
  position: relative;
  padding-bottom: 0.5rem;
}

h2.text-3xl.font-bold::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* ========== 按钮图标样式 ========== */
button svg {
  transition: transform 0.3s ease;
}

button:hover svg {
  transform: scale(1.1);
}

/* ========== 进度指示器 ========== */
p.text-lg.font-medium {
  position: relative;
  display: inline-block;
  padding-left: 2rem;
}

p.text-lg.font-medium::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

/* ========== 移动端全局样式 ========== */
@media (max-width: 768px) {
  /* 隐藏桌面端的固定调试信息 */
  .debug-info {
    display: none !important;
  }
  
  /* 移动端主容器 */
  .mobile-container {
    padding-top: 60px; /* 为移动端导航栏留出空间 */
  }
  
  /* 移动端页面内容 */
  .mobile-page {
    min-height: calc(100vh - 60px);
    padding: 16px;
  }
  
  /* 移动端卡片样式 */
  .mobile-card {
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 16px;
  }
  
  /* 移动端按钮样式 */
  .mobile-btn {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .mobile-btn:active {
    transform: scale(0.95);
  }
  
  /* 移动端文本样式 */
  .mobile-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  .mobile-subtitle {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  /* 移动端网格布局 */
  .mobile-grid {
    display: grid;
    gap: 16px;
  }
  
  .mobile-grid-2 {
    grid-template-columns: 1fr 1fr;
  }
  
  .mobile-grid-1 {
    grid-template-columns: 1fr;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .mobile-grid-2 {
    grid-template-columns: 1fr;
  }
  
  .mobile-page {
    padding: 12px;
  }
  
  .mobile-title {
    font-size: 1.3rem;
  }
  
  .mobile-subtitle {
    font-size: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  /* 增大触摸目标 */
  button, .clickable {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* 移除悬停效果 */
  *:hover {
    transform: none !important;
  }
  
  /* 添加触摸反馈 */
  button:active, .clickable:active {
    opacity: 0.7;
    transform: scale(0.95);
  }
}
</style>