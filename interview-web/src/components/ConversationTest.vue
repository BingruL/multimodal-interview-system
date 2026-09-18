<template>
  <div class="conversation-test-container">
    <div class="background-gradient"></div>
    
    <div class="main-content">
      <div class="content-card">
        <div class="title-section">
          <h1 class="main-title">对话显示测试</h1>
          <p class="subtitle">测试语音转文字对话显示功能</p>
        </div>

        <!-- 测试控制区域 -->
        <div class="test-controls">
          <div class="control-section">
            <h3 class="section-title">测试控制</h3>
            <div class="control-buttons">
              <button @click="addAIMessage" class="test-btn ai-btn">
                添加AI消息
              </button>
              <button @click="addUserMessage" class="test-btn user-btn">
                添加用户消息
              </button>
              <button @click="clearMessages" class="test-btn clear-btn">
                清空消息
              </button>
              <button @click="toggleConnection" class="test-btn toggle-btn">
                {{ isConnected ? '断开连接' : '模拟连接' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 对话显示区域 -->
        <div class="conversation-display">
          <div class="conversation-container">
            <div class="conversation-header">
              <h3 class="conversation-title">
                <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                实时对话记录
              </h3>
              <div class="conversation-stats">
                <span class="stat-item">
                  <span class="stat-label">消息数:</span>
                  <span class="stat-value">{{ messageList.length }}</span>
                </span>
                <span class="stat-item">
                  <span class="stat-label">状态:</span>
                  <span class="stat-value" :class="{ 'active': isConnected }">
                    {{ isConnected ? '对话中' : '等待连接' }}
                  </span>
                </span>
              </div>
            </div>
            
            <div class="conversation-content">
              <div class="messages-list">
                <div v-if="messageList.length === 0" class="empty-message">
                  <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p>等待开始对话...</p>
                  <small>点击按钮添加测试消息</small>
                </div>
                
                <div v-else>
                  <div 
                    v-for="(message, index) in paginatedMessageList" 
                    :key="index + (currentPage - 1) * pageSize" 
                    class="message-item"
                    :class="{ 'ai-message': message.type === 'ai', 'user-message': message.type === 'user' }"
                  >
                    <div class="message-avatar">
                      <svg v-if="message.type === 'ai'" class="ai-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                      <svg v-else class="user-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="message-content">
                      <div class="message-sender">
                        {{ message.type === 'ai' ? 'AI面试官' : '您' }}
                      </div>
                      <div class="message-text">
                        {{ message.text }}
                      </div>
                      <div class="message-time">
                        {{ message.time }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- 消息分页组件 -->
                  <Pagination
                    v-if="messageList.length > pageSize"
                    :current-page="currentPage"
                    :total-items="messageList.length"
                    :page-size="pageSize"
                    @page-change="handlePageChange"
                    @page-size-change="handlePageSizeChange"
                  />
                </div>
              </div>
            </div>
            
            <!-- 实时状态指示器 -->
            <div v-if="isConnected" class="realtime-indicator">
              <div class="indicator-dot"></div>
              <span>实时语音转文字中...</span>
            </div>
          </div>
        </div>

        <!-- 返回按钮 -->
        <div class="back-section">
          <button @click="$emit('go-back')" class="back-button">
            <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue';
import Pagination from './Pagination.vue';

const emits = defineEmits(['go-back']);

const messageList = ref([]);
const isConnected = ref(false);

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(8);

// 计算属性：分页后的消息列表
const paginatedMessageList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return messageList.value.slice(start, end);
});

// 分页处理函数
const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 1; // 重置到第一页
};

// 模拟AI消息
const aiMessages = [
  "您好！我是AI面试官，很高兴见到您。请简单介绍一下您的工作经验。",
  "您提到有机器学习开发经验，能具体说说您使用过哪些技术栈吗？",
  "在您的项目中，您是如何处理数据预处理的？",
  "您认为在深度学习项目中，最重要的环节是什么？",
  "您对当前的AI发展趋势有什么看法？"
];

// 模拟用户消息
const userMessages = [
  "您好！我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
  "我主要使用TensorFlow和PyTorch来构建神经网络模型，也熟悉一些传统的机器学习算法。",
  "在数据预处理方面，我通常会进行数据清洗、特征工程和数据增强，确保数据质量。",
  "我认为最重要的环节是数据质量和模型调优，好的数据是成功的基础。",
  "我认为AI正在向更高效、更可解释的方向发展，大模型技术也在不断进步。"
];

// 添加AI消息
const addAIMessage = () => {
  const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
  const time = new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  messageList.value.push({
    type: 'ai',
    text: randomMessage,
    time: time
  });
};

// 添加用户消息
const addUserMessage = () => {
  const randomMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
  const time = new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  messageList.value.push({
    type: 'user',
    text: randomMessage,
    time: time
  });
};

// 清空消息
const clearMessages = () => {
  messageList.value = [];
};

// 切换连接状态
const toggleConnection = () => {
  isConnected.value = !isConnected.value;
};
</script>

<style scoped>
/* 容器样式 */
.conversation-test-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

/* 背景渐变 */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

/* 主要内容 */
.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
}

/* 内容卡片 */
.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 16px 0 0 0;
}

/* 测试控制区域 */
.test-controls {
  margin-bottom: 40px;
}

.control-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
}

.control-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.test-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ai-btn {
  background: rgba(102, 126, 234, 0.9);
  color: white;
}

.ai-btn:hover {
  background: rgba(102, 126, 234, 1);
  transform: translateY(-2px);
}

.user-btn {
  background: rgba(82, 196, 26, 0.9);
  color: white;
}

.user-btn:hover {
  background: rgba(82, 196, 26, 1);
  transform: translateY(-2px);
}

.clear-btn {
  background: rgba(255, 77, 79, 0.9);
  color: white;
}

.clear-btn:hover {
  background: rgba(255, 77, 79, 1);
  transform: translateY(-2px);
}

.toggle-btn {
  background: rgba(24, 144, 255, 0.9);
  color: white;
}

.toggle-btn:hover {
  background: rgba(24, 144, 255, 1);
  transform: translateY(-2px);
}

/* 对话显示区域样式 */
.conversation-display {
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.conversation-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.conversation-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversation-icon {
  width: 20px;
  height: 20px;
}

.conversation-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stat-label {
  opacity: 0.8;
}

.stat-value {
  font-weight: 600;
}

.stat-value.active {
  color: #52c41a;
}

.conversation-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-message p {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.empty-message small {
  font-size: 12px;
  opacity: 0.7;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.message-item.ai-message {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.message-item.user-message {
  background: rgba(82, 196, 26, 0.1);
  border: 1px solid rgba(82, 196, 26, 0.2);
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-avatar {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.user-avatar {
  width: 20px;
  height: 20px;
  color: #52c41a;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #666;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.realtime-indicator {
  background: rgba(82, 196, 26, 0.1);
  border-top: 1px solid rgba(82, 196, 26, 0.2);
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 返回按钮 */
.back-section {
  text-align: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.back-icon {
  width: 18px;
  height: 18px;
}

/* 滚动条样式 */
.conversation-content::-webkit-scrollbar {
  width: 6px;
}

.conversation-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.conversation-content::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.conversation-content::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .conversation-test-container {
    padding: 16px;
  }
  
  .content-card {
    padding: 24px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .control-buttons {
    gap: 8px;
  }
  
  .test-btn {
    padding: 10px 16px;
    font-size: 12px;
  }
  
  .conversation-header {
    padding: 12px 16px;
  }
  
  .conversation-title {
    font-size: 14px;
  }
  
  .conversation-stats {
    gap: 12px;
  }
  
  .stat-item {
    font-size: 11px;
  }
  
  .conversation-content {
    padding: 16px;
    max-height: 300px;
  }
  
  .messages-list {
    gap: 12px;
  }
  
  .message-item {
    padding: 10px;
  }
  
  .message-avatar {
    width: 28px;
    height: 28px;
  }
  
  .ai-avatar, .user-avatar {
    width: 16px;
    height: 16px;
  }
  
  .message-text {
    font-size: 13px;
  }
  
  .message-sender {
    font-size: 11px;
  }
  
  .message-time {
    font-size: 10px;
  }
}
</style>