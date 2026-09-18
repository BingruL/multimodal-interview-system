<template>
  <div class="mobile-home">
    <!-- 移动端欢迎区域 -->
    <div class="mobile-welcome">
      <div class="welcome-content">
        <h1 class="welcome-title">AI 模拟面试</h1>
        <p class="welcome-subtitle">提升面试技能，成就职业梦想</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-item">
          <div class="stat-number">12</div>
          <div class="stat-label">面试次数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">85%</div>
          <div class="stat-label">平均得分</div>
        </div>
      </div>
    </div>

    <!-- 快速操作卡片 -->
    <div class="quick-actions">
      <h2 class="section-title">🚀 快速开始</h2>
      <div class="action-cards">
        <div class="action-card tech-card" @click="handleStartInterview('tech', '前端工程师')">
          <div class="card-icon">💻</div>
          <div class="card-title">技术面试</div>
          <div class="card-desc">算法、编程、技术问答</div>
        </div>
        
        <div class="action-card hr-card" @click="handleStartInterview('hr', 'HR面试')">
          <div class="card-icon">👥</div>
          <div class="card-title">HR面试</div>
          <div class="card-desc">行为面试、软技能评估</div>
        </div>
      </div>
    </div>

    <!-- 面试领域选择 -->
    <div class="interview-domains">
      <h2 class="section-title">🎯 选择面试领域</h2>
      <div class="domains-list">
        <div 
          v-for="domain in mockInterviewDomains" 
          :key="domain.id" 
          class="domain-item"
          @click="toggleDomain(domain.id)"
        >
          <div class="domain-header">
            <span class="domain-icon">{{ getDomainIcon(domain.id) }}</span>
            <span class="domain-name">{{ domain.name }}</span>
            <span class="expand-icon" :class="{ 'expanded': expandedDomain === domain.id }">▼</span>
          </div>
          
          <div class="roles-container" v-show="expandedDomain === domain.id">
            <div class="roles-grid">
              <button
                v-for="role in domain.roles"
                :key="role"
                @click.stop="handleStartInterview(domain.id, role)"
                class="role-btn"
              >
                {{ role }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能工具 -->
    <div class="feature-tools">
      <h2 class="section-title">🛠️ 实用工具</h2>
      <div class="tools-grid">
        <div class="tool-card" @click="$emit('navigate-to-page', 'interview-records')">
          <div class="tool-icon">📊</div>
          <div class="tool-title">面试记录</div>
        </div>
        
        <div class="tool-card" @click="$emit('navigate-to-page', 'ability-analysis')">
          <div class="tool-icon">📈</div>
          <div class="tool-title">能力分析</div>
        </div>
        
        <div class="tool-card" @click="$emit('test-analysis')">
          <div class="tool-icon">🔧</div>
          <div class="tool-title">分析测试</div>
        </div>
        
        <div class="tool-card" @click="$emit('camera-test')">
          <div class="tool-icon">📷</div>
          <div class="tool-title">摄像头测试</div>
        </div>
        
        <div class="tool-card" @click="$emit('conversation-test')">
          <div class="tool-icon">💬</div>
          <div class="tool-title">对话测试</div>
        </div>
        
        <div class="tool-card resume-tool" @click="showResumeUpload = true">
          <div class="tool-icon">📄</div>
          <div class="tool-title">简历分析</div>
        </div>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <h2 class="section-title">⏰ 最近活动</h2>
      <div class="activity-list">
        <div 
          v-for="activity in paginatedActivities" 
          :key="activity.id" 
          class="activity-item"
        >
          <span class="activity-icon">{{ activity.icon }}</span>
          <div class="activity-content">
            <div class="activity-text">{{ activity.text }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </div>
      
      <!-- 简化的分页 -->
      <div v-if="activities.length > activitiesPageSize" class="pagination-simple">
        <button 
          @click="handleActivitiesPageChange(activitiesCurrentPage - 1)"
          :disabled="activitiesCurrentPage === 1"
          class="page-btn"
        >
          ‹ 上一页
        </button>
        <span class="page-info">
          {{ activitiesCurrentPage }} / {{ Math.ceil(activities.length / activitiesPageSize) }}
        </span>
        <button 
          @click="handleActivitiesPageChange(activitiesCurrentPage + 1)"
          :disabled="activitiesCurrentPage >= Math.ceil(activities.length / activitiesPageSize)"
          class="page-btn"
        >
          下一页 ›
        </button>
      </div>
    </div>

    <!-- 简历上传弹窗 -->
    <div v-if="showResumeUpload" class="resume-modal">
      <div class="modal-overlay" @click="showResumeUpload = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>📄 简历智能分析</h3>
          <button class="close-btn" @click="showResumeUpload = false">✕</button>
        </div>
        
        <div class="upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
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
        
        <div class="modal-actions">
          <button v-if="uploadedResume && !isAnalyzing" class="analyze-btn" @click="analyzeResume">
            开始分析简历
          </button>
          <div v-if="isAnalyzing" class="analyzing-status">
            <div class="spinner"></div>
            <span>正在分析简历...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { message } from 'ant-design-vue';
import { mockInterviewDomains } from '../utils/mockData';

const props = defineProps({
  userId: String,
  activities: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(['start-interview', 'test-analysis', 'camera-test', 'conversation-test', 'navigate-to-page']);

// 响应式数据
const expandedDomain = ref(null);
const showResumeUpload = ref(false);
const uploadedResume = ref(null);
const isAnalyzing = ref(false);
const activitiesCurrentPage = ref(1);
const activitiesPageSize = ref(5);

// 计算属性
const paginatedActivities = computed(() => {
  const start = (activitiesCurrentPage.value - 1) * activitiesPageSize.value;
  const end = start + activitiesPageSize.value;
  return props.activities.slice(start, end);
});

// 方法
const getDomainIcon = (domainId) => {
  const icons = {
    'tech': '💻',
    'product': '📱',
    'design': '🎨',
    'marketing': '📈',
    'hr': '👥',
    'finance': '💰'
  };
  return icons[domainId] || '💼';
};

const toggleDomain = (domainId) => {
  expandedDomain.value = expandedDomain.value === domainId ? null : domainId;
};

const handleStartInterview = (domainId, role) => {
  emits('start-interview', domainId, role);
};

const handleActivitiesPageChange = (page) => {
  if (page >= 1 && page <= Math.ceil(props.activities.length / activitiesPageSize.value)) {
    activitiesCurrentPage.value = page;
  }
};

const triggerFileUpload = () => {
  document.querySelector('input[type="file"]').click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedResume.value = file;
  }
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadedResume.value = file;
  }
};

const removeFile = () => {
  uploadedResume.value = null;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const analyzeResume = async () => {
  isAnalyzing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    message.success('简历分析完成！');
    showResumeUpload.value = false;
    uploadedResume.value = null;
  } catch (error) {
    message.error('简历分析失败，请重试');
  } finally {
    isAnalyzing.value = false;
  }
};
</script>

<style scoped>
.mobile-home {
  padding: 80px 16px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

/* 移动端欢迎区域 */
.mobile-welcome {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  text-align: center;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0 0 20px 0;
}

.welcome-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* 章节标题 */
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 16px 0;
  padding-left: 8px;
}

/* 快速操作卡片 */
.quick-actions {
  margin-bottom: 32px;
}

.action-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.action-card:active {
  transform: scale(0.95);
}

.tech-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hr-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 面试领域 */
.interview-domains {
  margin-bottom: 32px;
}

.domains-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.domain-item {
  border-bottom: 1px solid #f1f5f9;
}

.domain-item:last-child {
  border-bottom: none;
}

.domain-header {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.domain-header:hover {
  background: #f8fafc;
}

.domain-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.domain-name {
  flex: 1;
  font-weight: 500;
  color: #2d3748;
}

.expand-icon {
  transition: transform 0.3s ease;
  color: #64748b;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.roles-container {
  padding: 0 16px 16px;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.role-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.role-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 功能工具 */
.feature-tools {
  margin-bottom: 32px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tool-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.tool-card:active {
  transform: scale(0.95);
}

.tool-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.tool-title {
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
}

.resume-tool {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* 最近活动 */
.recent-activity {
  margin-bottom: 32px;
}

.activity-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.95rem;
  color: #2d3748;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 0.8rem;
  color: #64748b;
}

/* 简化分页 */
.pagination-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 0 0 16px 16px;
}

.page-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #64748b;
}

/* 简历上传弹窗 */
.resume-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area {
  margin: 20px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 3rem;
  color: #64748b;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.upload-hint {
  font-size: 0.9rem;
  color: #64748b;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
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
  color: #2d3748;
  margin-bottom: 4px;
}

.file-size {
  font-size: 0.9rem;
  color: #64748b;
}

.remove-file {
  background: #fee2e2;
  border: none;
  color: #dc2626;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-actions {
  padding: 20px;
}

.analyze-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.analyzing-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  color: #64748b;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .action-cards {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .roles-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-stats {
    gap: 20px;
  }
}
</style>