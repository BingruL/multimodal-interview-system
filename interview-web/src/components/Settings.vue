<template>
  <div class="settings-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="$emit('go-back')">
          <span class="back-icon">←</span>
          返回首页
        </button>
        <h1 class="page-title">⚙️ 系统设置</h1>
        <div class="breadcrumb">首页 / 设置</div>
      </div>
      <div class="header-right">
        <button class="save-all-btn" @click="saveAllSettings" :disabled="!hasUnsavedChanges">
          💾 保存所有设置
        </button>
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 个人信息设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">👤 个人信息</h2>
          <div class="section-description">管理您的个人资料和基本信息</div>
        </div>
        
        <div class="settings-card">
          <div class="profile-section">
            <div class="avatar-section">
              <div class="avatar-container">
                <img 
                  :src="userProfile.avatar || '/default-avatar.png'" 
                  :alt="userProfile.name"
                  class="avatar-image"
                  @error="handleAvatarError"
                >
                <button class="avatar-upload-btn" @click="triggerAvatarUpload">
                  📷
                </button>
                <input 
                  ref="avatarInput" 
                  type="file" 
                  accept="image/*" 
                  @change="handleAvatarUpload" 
                  style="display: none;"
                >
              </div>
            </div>
            
            <div class="profile-form">
              <div class="form-group">
                <label class="form-label">姓名</label>
                <input 
                  v-model="userProfile.name" 
                  type="text" 
                  class="form-input"
                  placeholder="请输入您的姓名"
                  @input="markAsChanged"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">邮箱</label>
                <input 
                  v-model="userProfile.email" 
                  type="email" 
                  class="form-input"
                  placeholder="请输入您的邮箱"
                  @input="markAsChanged"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">职位</label>
                <input 
                  v-model="userProfile.position" 
                  type="text" 
                  class="form-input"
                  placeholder="请输入您的职位"
                  @input="markAsChanged"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">公司</label>
                <input 
                  v-model="userProfile.company" 
                  type="text" 
                  class="form-input"
                  placeholder="请输入您的公司"
                  @input="markAsChanged"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">个人简介</label>
                <textarea 
                  v-model="userProfile.bio" 
                  class="form-textarea"
                  placeholder="请输入个人简介"
                  rows="3"
                  @input="markAsChanged"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">🎯 面试设置</h2>
          <div class="section-description">配置面试相关的参数和偏好</div>
        </div>
        
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">默认面试时长</h3>
              <div class="setting-description">设置每次面试的默认时长</div>
            </div>
            <div class="setting-control">
              <select v-model="interviewSettings.defaultDuration" @change="markAsChanged" class="form-select">
                <option value="15">15分钟</option>
                <option value="30">30分钟</option>
                <option value="45">45分钟</option>
                <option value="60">60分钟</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">面试难度</h3>
              <div class="setting-description">选择面试题目的默认难度级别</div>
            </div>
            <div class="setting-control">
              <div class="radio-group">
                <label class="radio-item">
                  <input 
                    v-model="interviewSettings.difficulty" 
                    type="radio" 
                    value="easy"
                    @change="markAsChanged"
                  >
                  <span class="radio-label">简单</span>
                </label>
                <label class="radio-item">
                  <input 
                    v-model="interviewSettings.difficulty" 
                    type="radio" 
                    value="medium"
                    @change="markAsChanged"
                  >
                  <span class="radio-label">中等</span>
                </label>
                <label class="radio-item">
                  <input 
                    v-model="interviewSettings.difficulty" 
                    type="radio" 
                    value="hard"
                    @change="markAsChanged"
                  >
                  <span class="radio-label">困难</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">自动录音</h3>
              <div class="setting-description">面试过程中自动录制音频</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="interviewSettings.autoRecord" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">实时反馈</h3>
              <div class="setting-description">面试过程中显示实时评分和建议</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="interviewSettings.realtimeFeedback" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">面试提醒</h3>
              <div class="setting-description">在面试开始前发送提醒通知</div>
            </div>
            <div class="setting-control">
              <select v-model="interviewSettings.reminderTime" @change="markAsChanged" class="form-select">
                <option value="0">不提醒</option>
                <option value="5">5分钟前</option>
                <option value="10">10分钟前</option>
                <option value="15">15分钟前</option>
                <option value="30">30分钟前</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统偏好设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">🎨 系统偏好</h2>
          <div class="section-description">个性化您的使用体验</div>
        </div>
        
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">主题模式</h3>
              <div class="setting-description">选择您喜欢的界面主题</div>
            </div>
            <div class="setting-control">
              <div class="theme-selector">
                <button 
                  v-for="theme in themes" 
                  :key="theme.value"
                  :class="['theme-option', { active: systemSettings.theme === theme.value }]"
                  @click="selectTheme(theme.value)"
                >
                  <span class="theme-icon">{{ theme.icon }}</span>
                  <span class="theme-name">{{ theme.name }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">语言设置</h3>
              <div class="setting-description">选择界面显示语言</div>
            </div>
            <div class="setting-control">
              <select v-model="systemSettings.language" @change="markAsChanged" class="form-select">
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">音效设置</h3>
              <div class="setting-description">启用或关闭系统音效</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="systemSettings.soundEnabled" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">动画效果</h3>
              <div class="setting-description">启用或关闭界面动画效果</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="systemSettings.animationEnabled" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">自动保存</h3>
              <div class="setting-description">自动保存面试记录和设置</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="systemSettings.autoSave" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私与安全 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">🔒 隐私与安全</h2>
          <div class="section-description">管理您的隐私和数据安全设置</div>
        </div>
        
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">数据收集</h3>
              <div class="setting-description">允许收集匿名使用数据以改进服务</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="privacySettings.dataCollection" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">面试录音保存</h3>
              <div class="setting-description">设置面试录音的保存时长</div>
            </div>
            <div class="setting-control">
              <select v-model="privacySettings.recordingRetention" @change="markAsChanged" class="form-select">
                <option value="7">7天</option>
                <option value="30">30天</option>
                <option value="90">90天</option>
                <option value="365">1年</option>
                <option value="-1">永久保存</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">密码保护</h3>
              <div class="setting-description">启用密码保护以增强安全性</div>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input 
                  v-model="privacySettings.passwordProtection" 
                  type="checkbox"
                  @change="markAsChanged"
                >
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item danger-item">
            <div class="setting-info">
              <h3 class="setting-name">清除所有数据</h3>
              <div class="setting-description">删除所有面试记录和个人数据（不可恢复）</div>
            </div>
            <div class="setting-control">
              <button class="danger-btn" @click="showClearDataDialog">
                🗑️ 清除数据
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于信息 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title">ℹ️ 关于</h2>
          <div class="section-description">应用信息和帮助</div>
        </div>
        
        <div class="settings-card">
          <div class="about-content">
            <div class="app-info">
              <div class="app-icon">🤖</div>
              <div class="app-details">
                <h3 class="app-name">AI面试助手</h3>
                <div class="app-version">版本 {{ appInfo.version }}</div>
                <div class="app-description">{{ appInfo.description }}</div>
              </div>
            </div>
            
            <div class="about-links">
              <a href="#" class="about-link" @click.prevent="openHelp">
                📖 使用帮助
              </a>
              <a href="#" class="about-link" @click.prevent="openPrivacyPolicy">
                🔒 隐私政策
              </a>
              <a href="#" class="about-link" @click.prevent="openTerms">
                📋 服务条款
              </a>
              <a href="#" class="about-link" @click.prevent="checkUpdates">
                🔄 检查更新
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">{{ dialogTitle }}</h3>
          <button class="dialog-close" @click="closeDialog">×</button>
        </div>
        <div class="dialog-body">
          <p>{{ dialogMessage }}</p>
        </div>
        <div class="dialog-footer">
          <button class="dialog-btn cancel-btn" @click="closeDialog">
            取消
          </button>
          <button class="dialog-btn confirm-btn" @click="confirmDialog">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

defineEmits(['go-back']);

// 响应式数据
const hasUnsavedChanges = ref(false);
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const dialogAction = ref(null);

// 用户资料
const userProfile = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  position: '前端工程师',
  company: '科技有限公司',
  bio: '热爱技术，专注于前端开发和用户体验设计。',
  avatar: ''
});

// 面试设置
const interviewSettings = ref({
  defaultDuration: 30,
  difficulty: 'medium',
  autoRecord: true,
  realtimeFeedback: true,
  reminderTime: 10
});

// 系统设置
const systemSettings = ref({
  theme: 'light',
  language: 'zh-CN',
  soundEnabled: true,
  animationEnabled: true,
  autoSave: true
});

// 隐私设置
const privacySettings = ref({
  dataCollection: true,
  recordingRetention: 30,
  passwordProtection: false
});

// 应用信息
const appInfo = ref({
  version: '1.0.0',
  description: '基于AI技术的智能面试练习平台，帮助您提升面试技能和表现。'
});

// 主题选项
const themes = ref([
  { value: 'light', name: '浅色', icon: '☀️' },
  { value: 'dark', name: '深色', icon: '🌙' },
  { value: 'auto', name: '自动', icon: '🔄' }
]);

// 头像输入引用
const avatarInput = ref(null);

// 方法
const markAsChanged = () => {
  hasUnsavedChanges.value = true;
};

const saveAllSettings = () => {
  // 模拟保存设置
  console.log('保存所有设置:', {
    userProfile: userProfile.value,
    interviewSettings: interviewSettings.value,
    systemSettings: systemSettings.value,
    privacySettings: privacySettings.value
  });
  
  hasUnsavedChanges.value = false;
  
  // 显示成功提示
  showSuccessMessage('设置已保存');
};

const selectTheme = (theme) => {
  systemSettings.value.theme = theme;
  markAsChanged();
  
  // 应用主题
  applyTheme(theme);
};

const applyTheme = (theme) => {
  // 这里可以实现主题切换逻辑
  console.log('应用主题:', theme);
};

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 这里可以实现头像上传逻辑
    const reader = new FileReader();
    reader.onload = (e) => {
      userProfile.value.avatar = e.target.result;
      markAsChanged();
    };
    reader.readAsDataURL(file);
  }
};

const handleAvatarError = () => {
  // 头像加载失败时的处理
  userProfile.value.avatar = '';
};

const showClearDataDialog = () => {
  dialogTitle.value = '清除所有数据';
  dialogMessage.value = '此操作将永久删除所有面试记录和个人数据，且无法恢复。您确定要继续吗？';
  dialogAction.value = clearAllData;
  showDialog.value = true;
};

const clearAllData = () => {
  // 清除数据逻辑
  console.log('清除所有数据');
  showSuccessMessage('数据已清除');
};

const closeDialog = () => {
  showDialog.value = false;
  dialogAction.value = null;
};

const confirmDialog = () => {
  if (dialogAction.value) {
    dialogAction.value();
  }
  closeDialog();
};

const openHelp = () => {
  console.log('打开帮助页面');
};

const openPrivacyPolicy = () => {
  console.log('打开隐私政策');
};

const openTerms = () => {
  console.log('打开服务条款');
};

const checkUpdates = () => {
  console.log('检查更新');
  showSuccessMessage('当前已是最新版本');
};

const showSuccessMessage = (message) => {
  // 这里可以实现成功提示的逻辑
  console.log('成功:', message);
};
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  padding: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-left {
  flex: 1;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.back-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.back-icon {
  font-size: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.breadcrumb {
  color: #64748b;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.save-all-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-all-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.save-all-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* 设置内容 */
.settings-content {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.section-description {
  color: #64748b;
  font-size: 0.9rem;
}

.settings-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 个人资料 */
.profile-section {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e2e8f0;
  background: #f1f5f9;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
}

.avatar-upload-btn:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-input, .form-select, .form-textarea {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid #f1f5f9;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 20px;
}

.setting-name {
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.setting-description {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

.setting-control {
  flex-shrink: 0;
}

/* 开关按钮 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-item input[type="radio"] {
  margin: 0;
}

.radio-label {
  font-size: 0.9rem;
  color: #374151;
}

/* 主题选择器 */
.theme-selector {
  display: flex;
  gap: 8px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
}

.theme-option:hover {
  border-color: #3b82f6;
}

.theme-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.theme-icon {
  font-size: 1.2rem;
}

.theme-name {
  font-size: 0.8rem;
  color: #374151;
}

/* 危险操作 */
.danger-item {
  background: #fef2f2;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
}

.danger-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: #b91c1c;
}

/* 关于信息 */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border-radius: 16px;
}

.app-details {
  flex: 1;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.app-version {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.app-description {
  color: #374151;
  line-height: 1.5;
}

.about-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.about-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  transition: all 0.3s ease;
}

.about-link:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0;
}

.dialog-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-body {
  padding: 16px 24px;
}

.dialog-body p {
  margin: 0;
  color: #374151;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 20px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.confirm-btn {
  background: #dc2626;
  color: white;
  border: none;
}

.confirm-btn:hover {
  background: #b91c1c;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .profile-section {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .setting-info {
    margin-right: 0;
  }
  
  .theme-selector {
    width: 100%;
    justify-content: space-between;
  }
  
  .theme-option {
    flex: 1;
  }
  
  .about-links {
    grid-template-columns: 1fr;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 8px;
  }
}
</style>