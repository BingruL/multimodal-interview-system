<template>
  <div class="dashboard-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo-icon">🎯</div>
          <h2 class="logo-text">AI面试官</h2>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: currentNavItem === 'home' }">
            <a href="#" @click.prevent="handleNavigation('home')">
              <span class="icon">🏠</span>
              <span>首页</span>
            </a>
          </li>
          <li :class="{ active: currentNavItem === 'interview-records' }">
            <a href="#" @click.prevent="handleNavigation('interview-records')">
              <span class="icon">📊</span>
              <span>面试记录</span>
            </a>
          </li>
          <li :class="{ active: currentNavItem === 'ability-analysis' }">
            <a href="#" @click.prevent="handleNavigation('ability-analysis')">
              <span class="icon">📈</span>
              <span>能力分析</span>
            </a>
          </li>
          <li :class="{ active: currentNavItem === 'settings' }">
            <a href="#" @click.prevent="handleNavigation('settings')">
              <span class="icon">⚙️</span>
              <span>设置</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">AI 模拟面试系统</h1>
          <div class="breadcrumb">首页 / 面试选择</div>
        </div>
        <div class="header-right">
          <div class="user-profile">
            <div class="avatar">👤</div>
            <span class="username">{{ userId || '用户' }}</span>
          </div>
        </div>
      </div>

      <!-- 欢迎横幅 -->
      <div class="card welcome-banner">
        <div class="welcome-text">
          <h2>欢迎使用 AI 模拟面试系统</h2>
          <div class="user-info-item">助您提升面试能力，成就职业梦想！</div>
        </div>
        <div class="welcome-icon">🚀</div>
      </div>

      <!-- 功能卡片网格 -->
      <div class="widgets-grid">
        <!-- 快速开始卡片 -->
        <div class="card quick-start-card">
          <h3 class="card-title">🎯 快速开始面试</h3>
          <p class="card-description">选择您想要练习的面试类型，立即开始模拟面试</p>
          <div class="quick-actions">
            <button class="btn btn-primary" @click="handleStartInterview('tech', '前端工程师')">
              技术面试
            </button>
            <button class="btn btn-secondary" @click="handleStartInterview('hr', 'HR面试')">
              HR面试
            </button>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="card stats-card">
          <h3 class="card-title">📊 面试统计</h3>
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-number">12</div>
              <div class="stat-label">总面试次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">85%</div>
              <div class="stat-label">平均得分</div>
            </div>
          </div>
        </div>

        <!-- 简历分析卡片 -->
        <div class="card resume-analysis-card">
          <h3 class="card-title">📄 简历智能分析</h3>
          <p class="card-description">上传您的简历，AI将为您提供专业的分析和建议</p>
          <div class="resume-upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
            <div v-if="!uploadedResume" class="upload-placeholder">
              <div class="upload-icon">📁</div>
              <div class="upload-text">点击或拖拽上传简历</div>
              <div class="upload-hint">支持 PDF、DOC、DOCX 格式</div>
            </div>
            <div v-else class="uploaded-file">
              <div class="file-icon">📄</div>
              <div class="file-info">
                <div class="file-name">{{ uploadedResume.name }}</div>
                <div class="file-size">{{ formatFileSize(uploadedResume.size) }}</div>
              </div>
              <button class="remove-file" @click.stop="removeFile">✕</button>
            </div>
          </div>
          <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" @change="handleFileUpload" style="display: none;">
          <button v-if="uploadedResume && !isAnalyzing" class="btn btn-primary analyze-btn" @click="analyzeResume">
            开始分析简历
          </button>
          <div v-if="isAnalyzing" class="analyzing-status">
            <div class="spinner"></div>
            <span>正在分析简历...</span>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="card recent-activity">
          <h3 class="card-title">⏰ 最近活动</h3>
          <div class="activity-list">
            <div 
              v-for="activity in paginatedActivities" 
              :key="activity.id" 
              class="activity-item"
            >
              <span class="activity-icon">{{ activity.icon }}</span>
              <span class="activity-text">{{ activity.text }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
          
          <!-- 分页组件 -->
          <Pagination
            v-if="activities.length > activitiesPageSize"
            :current-page="activitiesCurrentPage"
            :total-items="activities.length"
            :page-size="activitiesPageSize"
            @page-change="handleActivitiesPageChange"
            @page-size-change="handleActivitiesPageSizeChange"
          />
        </div>
      </div>

      <!-- 面试领域选择 -->
      <div class="card selection-section">
        <h2 class="section-title">选择面试领域与岗位</h2>
        <div class="domains-container">
          <div 
            v-for="domain in mockInterviewDomains" 
            :key="domain.id" 
            class="domain-card"
          >
            <div class="domain-header">
              <span class="domain-icon">{{ getDomainIcon(domain.id) }}</span>
              <h3 class="domain-title">{{ domain.name }}</h3>
            </div>
            <div class="roles-grid">
              <button
                v-for="role in domain.roles"
                :key="role"
                @click="handleStartInterview(domain.id, role)"
                class="role-button"
              >
                {{ role }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 简历分析结果 -->
      <div v-if="resumeAnalysis" class="card analysis-results">
        <h2 class="section-title">📊 简历分析结果</h2>
        <div class="analysis-grid">
          <div class="analysis-section">
            <h4 class="analysis-title">📈 综合评分</h4>
            <div class="score-display">
              <div class="score-circle">
                <span class="score-number">{{ resumeAnalysis.overallScore }}</span>
                <span class="score-label">分</span>
              </div>
              <div class="score-description">{{ getScoreDescription(resumeAnalysis.overallScore) }}</div>
            </div>
          </div>
          
          <div class="analysis-section">
            <h4 class="analysis-title">💪 技能匹配度</h4>
            <div class="skills-analysis">
              <div v-for="skill in resumeAnalysis.skills" :key="skill.name" class="skill-item">
                <div class="skill-name">{{ skill.name }}</div>
                <div class="skill-bar">
                  <div class="skill-progress" :style="{ width: skill.score + '%' }"></div>
                </div>
                <div class="skill-score">{{ skill.score }}%</div>
              </div>
            </div>
          </div>
          
          <div class="analysis-section">
            <h4 class="analysis-title">✨ 优势亮点</h4>
            <ul class="highlights-list">
              <li v-for="highlight in resumeAnalysis.highlights" :key="highlight" class="highlight-item">
                {{ highlight }}
              </li>
            </ul>
          </div>
          
          <div class="analysis-section">
            <h4 class="analysis-title">🔧 改进建议</h4>
            <ul class="suggestions-list">
              <li v-for="suggestion in resumeAnalysis.suggestions" :key="suggestion" class="suggestion-item">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 测试功能区域 -->
      <div class="card test-section">
        <h3 class="section-title">🔧 系统测试功能</h3>
        <div class="test-buttons-grid">
          <button
            @click="$emit('test-analysis')"
            class="test-card analysis-test"
          >
            <div class="test-icon">📊</div>
            <div class="test-title">分析功能测试</div>
            <div class="test-description">测试AI分析能力</div>
          </button>
          
          <button
            @click="$emit('fullscreen-camera-test')"
            class="test-card camera-test"
          >
            <div class="test-icon">📹</div>
            <div class="test-title">摄像头测试</div>
            <div class="test-description">测试全屏摄像头功能</div>
          </button>
          
          <button
            @click="$emit('conversation-test')"
            class="test-card conversation-test"
          >
            <div class="test-icon">💬</div>
            <div class="test-title">对话测试</div>
            <div class="test-description">测试对话显示功能</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { mockInterviewDomains } from '../utils/mockData';
import Pagination from './Pagination.vue';

const props = defineProps({
  userId: String,
});

const emits = defineEmits([
  'start-interview', 
  'test-analysis', 
  'camera-test', 
  'fullscreen-camera-test', 
  'conversation-test',
  'navigate-to-page'
]);

// 导航相关状态
const currentNavItem = ref('home');

// 导航处理方法
const handleNavigation = (navItem) => {
  currentNavItem.value = navItem;
  
  // 根据导航项执行相应操作
  switch (navItem) {
    case 'home':
      // 已经在首页，无需额外操作
      break;
    case 'interview-records':
      // 触发导航到面试记录页面
      emits('navigate-to-page', 'interview-records');
      break;
    case 'ability-analysis':
      // 触发导航到能力分析页面
      emits('navigate-to-page', 'ability-analysis');
      break;
    case 'settings':
      // 触发导航到设置页面
      emits('navigate-to-page', 'settings');
      break;
    default:
      console.log('未知的导航项:', navItem);
  }
};

// 简历上传相关数据
const fileInput = ref(null);
const uploadedResume = ref(null);
const isAnalyzing = ref(false);
const resumeAnalysis = ref(null);

// 活动数据和分页
const activities = ref([
  { id: 1, icon: '💼', text: '完成了前端工程师面试', time: '2小时前' },
  { id: 2, icon: '📝', text: '查看了面试报告', time: '1天前' },
  { id: 3, icon: '🎯', text: '开始了算法工程师面试', time: '2天前' },
  { id: 4, icon: '📊', text: '分析了简历内容', time: '3天前' },
  { id: 5, icon: '💡', text: '查看了学习推荐', time: '4天前' },
  { id: 6, icon: '🔧', text: '测试了摄像头功能', time: '5天前' },
  { id: 7, icon: '📈', text: '完成了产品经理面试', time: '1周前' },
  { id: 8, icon: '🎨', text: '参与了UI设计师面试', time: '1周前' },
  { id: 9, icon: '💰', text: '完成了财务分析师面试', time: '2周前' },
  { id: 10, icon: '📢', text: '参与了市场营销面试', time: '2周前' },
  { id: 11, icon: '🚀', text: '开始了项目管理面试', time: '3周前' },
  { id: 12, icon: '👥', text: '完成了HR面试', time: '3周前' }
]);

const activitiesCurrentPage = ref(1);
const activitiesPageSize = ref(5);

// 计算分页后的活动数据
const paginatedActivities = computed(() => {
  const start = (activitiesCurrentPage.value - 1) * activitiesPageSize.value;
  const end = start + activitiesPageSize.value;
  return activities.value.slice(start, end);
});

// 处理活动分页变化
const handleActivitiesPageChange = (page) => {
  activitiesCurrentPage.value = page;
};

const handleActivitiesPageSizeChange = (size) => {
  activitiesPageSize.value = size;
  activitiesCurrentPage.value = 1; // 重置到第一页
};

const handleStartInterview = (domainId, role) => {
  emits('start-interview', domainId, role);
};

const getDomainIcon = (domainId) => {
  const iconMap = {
    'tech': '💻',
    'hr': '👥',
    'management': '📋',
    'sales': '💼',
    'design': '🎨',
    'finance': '💰',
    'marketing': '📢',
    'product': '🚀'
  };
  return iconMap[domainId] || '📝';
};

// 简历上传功能
const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedResume.value = file;
    resumeAnalysis.value = null; // 清除之前的分析结果
  }
};

const handleFileDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      uploadedResume.value = file;
      resumeAnalysis.value = null;
    } else {
      alert('请上传PDF、DOC或DOCX格式的文件');
    }
  }
};

const removeFile = () => {
  uploadedResume.value = null;
  resumeAnalysis.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 简历分析功能
const analyzeResume = async () => {
  if (!uploadedResume.value) return;
  
  isAnalyzing.value = true;
  
  try {
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 模拟分析结果
    resumeAnalysis.value = {
      overallScore: Math.floor(Math.random() * 20) + 80, // 80-100分
      skills: [
        { name: 'JavaScript', score: Math.floor(Math.random() * 30) + 70 },
        { name: 'Vue.js', score: Math.floor(Math.random() * 30) + 70 },
        { name: 'React', score: Math.floor(Math.random() * 40) + 60 },
        { name: '项目管理', score: Math.floor(Math.random() * 25) + 75 },
        { name: '团队协作', score: Math.floor(Math.random() * 20) + 80 }
      ],
      highlights: [
        '具有丰富的前端开发经验',
        '熟练掌握现代JavaScript框架',
        '有良好的项目管理能力',
        '具备优秀的团队协作精神',
        '持续学习新技术的能力强'
      ],
      suggestions: [
        '建议增加更多具体的项目成果描述',
        '可以添加一些量化的工作成就',
        '建议补充相关的技术认证',
        '可以增加一些开源项目经验',
        '建议优化简历的整体排版和结构'
      ]
    };
  } catch (error) {
    console.error('简历分析失败:', error);
    alert('简历分析失败，请稍后重试');
  } finally {
    isAnalyzing.value = false;
  }
};

const getScoreDescription = (score) => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '中等';
  if (score >= 60) return '及格';
  return '需要改进';
};
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
}

/* 仪表板容器 */
.dashboard-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f4f7fa;
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e6ed;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.sidebar-header {
  margin-bottom: 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.sidebar-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li a {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  gap: 12px;
}

.sidebar-nav li a:hover,
.sidebar-nav li.active a {
  background-color: #eef2ff;
  color: #4f46e5;
  transform: translateX(4px);
}

.sidebar-nav li a .icon {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

/* 主内容区 */
.main-content {
  flex-grow: 1;
  padding: 24px 30px;
  overflow-y: auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.breadcrumb {
  color: #6b7280;
  font-size: 0.9rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.username {
  font-weight: 600;
  color: #374151;
}

/* 卡片样式 */
.card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #f8faff 0%, #fff 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e0e7ff;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.user-info-item {
  color: #6b7280;
  font-size: 1rem;
}

.welcome-icon {
  font-size: 3rem;
  opacity: 0.8;
}

/* 网格布局 */
.widgets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 卡片标题 */
.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

/* 快速开始卡片 */
.card-description {
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 按钮样式 */
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

/* 统计卡片 */
.stats-content {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 4px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* 最近活动 */
.activity-list {
  space-y: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.2rem;
  width: 32px;
  text-align: center;
}

.activity-text {
  flex: 1;
  color: #374151;
  font-size: 0.9rem;
}

.activity-time {
  color: #9ca3af;
  font-size: 0.8rem;
}

/* 选择区域 */
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.domains-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.domain-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.domain-card:hover {
  background: white;
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
}

.domain-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.domain-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.domain-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.role-button {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.role-button:hover {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
  transform: translateY(-1px);
}

/* 测试功能区域 */
.test-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.test-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.test-card:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
}

.test-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.test-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.test-description {
  color: #6b7280;
  font-size: 0.85rem;
}

.analysis-test:hover {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.camera-test:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.conversation-test:hover {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

/* 简历分析卡片样式 */
.resume-analysis-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.resume-analysis-card .card-title,
.resume-analysis-card .card-description {
  color: white;
}

.resume-upload-area {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 16px 0;
  background: rgba(255, 255, 255, 0.1);
}

.resume-upload-area:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.upload-hint {
  font-size: 0.9rem;
  opacity: 0.8;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 8px;
}

.file-icon {
  font-size: 2rem;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.file-size {
  font-size: 0.9rem;
  opacity: 0.8;
}

.remove-file {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-file:hover {
  background: rgba(255, 255, 255, 0.3);
}

.analyze-btn {
  width: 100%;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.analyze-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

.analyzing-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 分析结果样式 */
.analysis-results {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.analysis-results .section-title {
  color: white;
  margin-bottom: 24px;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.analysis-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.analysis-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: white;
}

.score-display {
  text-align: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: rgba(255, 255, 255, 0.1);
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 1rem;
  opacity: 0.8;
}

.score-description {
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.9;
}

.skills-analysis {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skill-name {
  min-width: 80px;
  font-weight: 500;
}

.skill-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #00d2ff, #3a7bd5);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.skill-score {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
}

.highlights-list,
.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlight-item,
.suggestion-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  padding-left: 20px;
}

.highlight-item:before {
  content: '✨';
  position: absolute;
  left: 0;
}

.suggestion-item:before {
  content: '💡';
  position: absolute;
  left: 0;
}

.highlight-item:last-child,
.suggestion-item:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    padding: 16px;
  }
  
  .sidebar-nav {
    display: flex;
    overflow-x: auto;
  }
  
  .sidebar-nav ul {
    display: flex;
    gap: 8px;
    min-width: max-content;
  }
  
  .sidebar-nav li {
    flex-shrink: 0;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .widgets-grid {
    grid-template-columns: 1fr;
  }
  
  .domains-container {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .test-buttons-grid {
    grid-template-columns: 1fr;
  }
  
  .roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>