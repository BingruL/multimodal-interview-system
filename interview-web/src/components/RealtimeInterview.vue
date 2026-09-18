<template>
  <!-- 分析结果页面 -->
  <div v-if="showAnalysisResult && analysisResult" class="analysis-result-page">
    <div class="analysis-result-container">
      <div class="analysis-result-card">
        <h1 class="analysis-title">面试评测报告</h1>
        <p class="analysis-subtitle">
          领域: <span class="domain-text">{{ selectedDomainName }}</span> - 岗位: <span class="role-text">{{ selectedRole }}</span>
        </p>

        <!-- 雷达图分数 -->
        <div class="result-card">
          <h4 class="result-subtitle">雷达图分数</h4>
          
          <!-- 可视化雷达图 -->
          <div class="radar-chart-section">
            <RadarChart 
              :scores="analysisResult.radarChartScores || [85, 80, 75, 90, 70]" 
              :labels="['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变']"
              :size="320"
            />
          </div>
          
          <!-- 分数详情 -->
          <div class="scores-details">
            <div class="scores-grid">
              <div v-for="(score, index) in (analysisResult.radarChartScores || [85, 80, 75, 90, 70])" :key="index" class="score-item">
                <span class="score-label">{{ ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变'][index] }}:</span>
                <span class="score-value">{{ score }}</span>
              </div>
            </div>
          </div>
          
          <!-- 调试信息 -->
          <div v-if="analysisResult.radarChartScores" style="margin-top: 10px; font-size: 12px; color: #666;">
            雷达图数据: {{ JSON.stringify(analysisResult.radarChartScores) }}
          </div>
        </div>

        <!-- 关键问题定位 -->
        <div class="result-section">
          <h2 class="result-section-title">关键问题定位</h2>
          <ul class="issues-list">
            <li v-for="(issue, index) in analysisResult.feedbackData.keyIssues" :key="index" class="issue-item">
              {{ issue }}
            </li>
          </ul>
        </div>

        <!-- 改进建议 -->
        <div class="result-section">
          <h2 class="result-section-title">改进建议</h2>
          <ul class="suggestions-list">
            <li v-for="(suggestion, index) in analysisResult.feedbackData.improvementSuggestions" :key="index" class="suggestion-item">
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- 学习推荐 -->
        <div v-if="analysisResult.learningRecommendations && Object.keys(analysisResult.learningRecommendations).length > 0" class="result-section">
          <h2 class="result-section-title">学习推荐</h2>
          <div v-for="(items, category) in analysisResult.learningRecommendations" :key="category" class="recommendation-category">
            <h3 class="category-title">{{ category }}</h3>
            <ul class="recommendations-list">
              <li v-for="(item, index) in items" :key="index" class="recommendation-item">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button @click="backToInterview" class="action-btn back-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回面试
          </button>
          <button @click="emits('go-home')" class="action-btn home-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 面试页面 -->
  <FullscreenCamera 
    v-else
    ref="fullscreenCameraRef"
    @camera-status-changed="handleCameraStatusChanged"
  >
    <!-- 面试控制面板 -->
    <div class="interview-controls">
      <div class="control-panel">
        <h1 class="interview-title">实时AI面试进行中</h1>
        <p class="interview-subtitle">
          领域: <span class="domain-text">{{ selectedDomainName }}</span> - 岗位: <span class="role-text">{{ selectedRole }}</span>
        </p>

        <!-- 摄像头控制区域 -->
        <div class="camera-control-section">
          <h3 class="section-title">摄像头控制</h3>
          <div class="camera-control-buttons">
            <button 
              @click="enableCamera"
              class="camera-btn enable-btn"
              :disabled="isCameraLoading"
            >
              开启摄像头
            </button>
            <button 
              @click="disableCamera"
              class="camera-btn disable-btn"
              :disabled="isCameraLoading"
            >
              关闭摄像头
            </button>
            <button 
              @click="toggleCamera"
              class="camera-btn toggle-btn"
              :disabled="isCameraLoading"
            >
              切换摄像头
            </button>
          </div>
          
          <!-- 摄像头状态信息 -->
          <div class="camera-status-info">
            <div class="status-item">
              <span class="status-label">摄像头状态:</span>
              <span class="status-value" :class="{ 'active': isCameraEnabled }">
                {{ isCameraEnabled ? '已开启' : '已关闭' }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">浏览器支持:</span>
              <span class="status-value" :class="{ 'active': browserSupport }">
                {{ browserSupport ? '支持' : '不支持' }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">权限状态:</span>
              <span class="status-value">{{ permissionStatus }}</span>
            </div>
          </div>
        </div>

        <!-- 语音控制区域 -->
        <div class="voice-control-section">
          <h3 class="section-title">语音控制</h3>
          
          <!-- 通话控制区域 -->
          <div class="call-controls">
            <div class="call-buttons-row">
              <!-- 通话按钮 -->
              <div class="invoke-button-wrapper" :class="{ 'invoke-loading': isConnecting }">
                <div class="invoke-button" @click="handleRTCConnect">
                  <div class="invoke-btn">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNCA0QzEyLjk1IDQgNCAxMi45NSA0IDI0QzQgMzUuMDUgMTIuOTUgNDQgMjQgNDRDMzUuMDUgNDQgNDQgMzUuMDUgNDQgMjRDNDQgMTIuOTUgMzUuMDUgNCAyNCA0WiIgZmlsbD0iIzE4OTBGRiIvPgo8cGF0aCBkPSJNMzIgMjRMMjQgMTZMMTYgMjRMMjQgMzJMMzIgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="call">
                    <img v-if="!isConnecting" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyIDEwLjVWMTdIMjJWMjAuNUwyMCAyMlYxN0gxOFYxMC41SDE2VjE5SDE4VjI0SDIwVjE5SDIyVjEwLjVIMjJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" class="invoke-icon" alt="phone">
                    <div v-else class="invoke-loading-icon"></div>
                  </div>
                  <div class="invoke-text">{{ isConnecting ? '连接中' : '通话' }}</div>
                </div>
          </div>

              <!-- 挂断按钮 -->
              <div v-if="isConnected" class="leave-button-wrapper">
                <div class="leave-button" @click="handleDisconnect">
                  <div class="leave-btn">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjA5IDE1LjU5TDE2LjY3IDlMMTggMTAuNDFMMTEuNDIgMTdMMTggMjMuNTlMMTYuNjcgMjVMMTAuMDkgMTguNDFMMTMuNjcgMTQuODNMMTIuMjYgMTMuNDJMMTAuMDkgMTUuNTlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="leave" class="leave-icon">
                  </div>
                  <div class="leave-text">挂断</div>
                </div>
              </div>
              
              <!-- 结束面试按钮 -->
              <div v-if="isConnected" class="end-interview-button-wrapper">
                <div class="end-interview-button" @click="handleEndInterview">
                  <div class="end-interview-btn">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNGRjQ0NDQiLz4KPHBhdGggZD0iTTE1IDlMMTkgMTNMMTUgMTdMMTYuNDEgMTUuNTlMMTguODMgMTNMMTYuNDEgMTAuNDFMMTUgOVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" alt="end" class="end-interview-icon">
                  </div>
                  <div class="end-interview-text">结束面试</div>
                </div>
              </div>
            </div>
          </div>





          <div class="connection-status">
            <p>连接状态: {{ connectStatus }}</p>
          </div>
          
          <!-- 测试功能 -->
          <div class="test-section">
            <h4 class="test-title">测试功能</h4>
            <div class="test-buttons">
              <a-button size="small" @click="addTestMessage">
                添加测试消息
              </a-button>
              <a-button size="small" @click="addTestSubtitle">
                添加测试字幕
              </a-button>
              <a-button size="small" @click="clearMessages">
                清空消息
              </a-button>
              <a-button size="small" @click="showMessageCount">
                显示消息数
              </a-button>
              <a-button size="small" @click="testAnalysisComplete">
                测试分析完成
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D虚拟面试官区域 -->
    <div class="virtual-interviewer-section">
      <VirtualInterviewer 
        :is-speaking="isConnected && messageList.length > 0 && messageList.length % 2 === 1"
        :is-listening="isConnected && !isConnecting"
        :current-message="messageList[messageList.length - 1] || ''"
        @expression-changed="handleExpressionChanged"
        @gesture-played="handleGesturePlayd"
      />
    </div>

    <!-- 统一对话显示区域 -->
    <div class="conversation-display">
      <div class="conversation-container">
        <div class="conversation-header">
          <h3 class="conversation-title">
            <svg class="conversation-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            实时对话记录
          </h3>
          <div class="conversation-controls">
            <!-- 字幕开关 -->
            <div class="subtitle-toggle-control">
              <span class="subtitle-label">字幕</span>
              <a-switch 
                v-model:checked="subtitleEnabled" 
                size="small"
                @change="handleSubtitleToggle"
              />
            </div>
            <!-- 统计信息 -->
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
        </div>
        
        <div class="conversation-content">
          <div class="messages-list">
            <div v-if="messageList.length === 0 && subtitleHistory.length === 0" class="empty-message">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>等待开始对话...</p>
              <small>连接后将显示语音转文字的实时对话内容</small>
            </div>
            
            <div v-else>
              <!-- 显示对话消息 -->
              <div 
                v-for="(message, index) in paginatedMessageList" 
                :key="`msg-${index + (messagesCurrentPage - 1) * messagesPageSize}`" 
                class="message-item"
                :class="{ 'ai-message': (index + (messagesCurrentPage - 1) * messagesPageSize) % 2 === 0, 'user-message': (index + (messagesCurrentPage - 1) * messagesPageSize) % 2 === 1 }"
              >
                <div class="message-avatar">
                  <svg v-if="(index + (messagesCurrentPage - 1) * messagesPageSize) % 2 === 0" class="ai-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  <svg v-else class="user-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="message-content">
                  <div class="message-sender">
                    {{ (index + (messagesCurrentPage - 1) * messagesPageSize) % 2 === 0 ? 'AI面试官' : '您' }}
                  </div>
                  <div class="message-text">
                    {{ message }}
                  </div>
                  <div class="message-time">
                    {{ formatMessageTime(index + (messagesCurrentPage - 1) * messagesPageSize) }}
                  </div>
                </div>
              </div>
              
              <!-- 消息分页组件 -->
              <Pagination
                v-if="messageList.length > messagesPageSize"
                :current-page="messagesCurrentPage"
                :total-items="messageList.length"
                :page-size="messagesPageSize"
                @page-change="handleMessagesPageChange"
                @page-size-change="handleMessagesPageSizeChange"
              />
              
              <!-- 显示字幕历史（如果启用） -->
              <div v-if="subtitleEnabled && subtitleHistory.length > 0" class="subtitle-section">
                <div class="subtitle-section-header">
                  <span class="subtitle-section-title">实时字幕 ({{ subtitleHistory.length }})</span>
                  <a-button size="small" @click="clearSubtitleHistory" type="text">
                    清空字幕
                  </a-button>
                </div>
                <div 
                  v-for="subtitle in subtitleHistory" 
                  :key="`subtitle-${subtitle.id}`"
                  class="subtitle-item"
                  :class="{ 'ai-subtitle': subtitle.user === 'AI', 'user-subtitle': subtitle.user === 'User' }"
                >
                  <div class="subtitle-user">{{ subtitle.user === 'AI' ? 'AI面试官' : '您' }}</div>
                  <div class="subtitle-text">{{ subtitle.text }}</div>
                  <div class="subtitle-time">{{ subtitle.timestamp }}</div>
                </div>
              </div>
              
              <!-- 当前实时字幕 -->
              <div v-if="subtitleEnabled && currentSubtitle && isSubtitleLoading" class="current-subtitle">
                <div class="subtitle-user">AI面试官</div>
                <div class="subtitle-text">
                  {{ currentSubtitle }}
                  <span class="subtitle-loading">...</span>
                </div>
              </div>
              
              <!-- 字幕状态调试信息 -->
              <div v-if="subtitleEnabled" class="subtitle-debug-info" style="font-size: 10px; color: #999; margin-top: 8px; padding: 4px; background: rgba(0,0,0,0.05); border-radius: 4px;">
                字幕状态: 已启用 | 历史数量: {{ subtitleHistory.length }} | 当前字幕: {{ currentSubtitle || '无' }} | 加载中: {{ isSubtitleLoading }} | 字幕开关: {{ subtitleEnabled }}
              </div>
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
    <button
      @click="emits('go-home')"
      class="back-button"
    >
      <HomeIcon class="mr-2" />
      返回首页
    </button>
  </FullscreenCamera>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, nextTick, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useTokenWithPat } from '../hooks/index'; // Corrected path
import { HomeIcon } from './Icons.js'; // Corrected path
import { analyzeInterview, mockAnalyzeInterview } from '../utils/apiService.js'; // Import API service
import FullscreenCamera from './FullscreenCamera.vue'; // 导入全屏摄像头组件
import RadarChart from './RadarChart.vue'; // 导入雷达图组件
import VirtualInterviewer from './VirtualInterviewer.vue'; // 导入3D虚拟面试官组件
import Pagination from './Pagination.vue'; // 导入分页组件

// 导入火山引擎RTC SDK
let VERTC = null;
let RTCAIAnsExtension = null;

// 动态导入RTC SDK
const loadRTCLibrary = async () => {
  try {
    console.log('尝试加载RTC SDK...');
    
    // 动态导入SDK
    const rtcModule = await import('@volcengine/rtc');
    const ainrModule = await import('@volcengine/rtc/extension-ainr');
    
    VERTC = rtcModule.default;
    RTCAIAnsExtension = ainrModule.default;
    
    // 检查SDK是否可用
    if (VERTC && typeof VERTC.createEngine === 'function') {
      console.log('RTC SDK加载成功');
      return true;
    }
    
    console.warn('RTC SDK未正确加载，将使用模拟模式');
    return false;
  } catch (error) {
    console.error('加载RTC SDK失败:', error);
    return false;
  }
};



const props = defineProps({
  selectedDomainName: String,
  selectedRole: String,
});

const emits = defineEmits(['go-home', 'interview-ended', 'analysis-complete']); // Emits events for navigation and analysis

// RTC API 配置
const RTC_PROXY_HOST = process.env.VUE_APP_RTC_PROXY_HOST || 'http://localhost:3001';
const { getToken } = useTokenWithPat();

// RTC Client 相关状态和方法
const client = ref(null);
const rtcEngine = ref(null);
const messageList = ref([]);
const isConnecting = ref(false);
const isConnected = ref(false);
const audioEnabled = ref(true);
const connectStatus = ref('disconnected');
const isMobileDevice = ref(false);
const messageTimestamps = ref([]);
const currentScene = ref(null);
const rtcConfig = ref(null);
const audioBotEnabled = ref(false);
const subtitleEnabled = ref(true);

// 全屏摄像头组件引用
const fullscreenCameraRef = ref(null);

// 摄像头状态管理
const isCameraEnabled = ref(false);
const isCameraLoading = ref(false);
const browserSupport = ref(false);
const permissionStatus = ref('未知');

// 添加分析结果状态
const analysisResult = ref(null);
const showAnalysisResult = ref(false);

// 虚拟面试官相关状态
const currentExpression = ref('neutral');
const lastGesture = ref(null);

// 消息分页相关状态
const messagesCurrentPage = ref(1);
const messagesPageSize = ref(10);

// 计算属性：分页后的消息列表
const paginatedMessageList = computed(() => {
  const start = (messagesCurrentPage.value - 1) * messagesPageSize.value;
  const end = start + messagesPageSize.value;
  return messageList.value.slice(start, end);
});

// 分页处理函数
const handleMessagesPageChange = (page) => {
  messagesCurrentPage.value = page;
};

const handleMessagesPageSizeChange = (pageSize) => {
  messagesPageSize.value = pageSize;
  messagesCurrentPage.value = 1; // 重置到第一页
};

// 获取场景配置
const getScenes = async () => {
  try {
    const response = await fetch(`${RTC_PROXY_HOST}/getScenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('获取场景配置成功:', result);
    
    // 根据服务器代码，数据应该在Result字段中
    let scenes = null;
    if (result.Result && result.Result.scenes) {
      scenes = result.Result.scenes;
    } else if (result.scenes) {
      scenes = result.scenes;
    }
    
    console.log('解析的场景数据:', scenes);
    
    if (scenes && scenes.length > 0) {
      const firstScene = scenes[0];
      console.log('第一个场景:', firstScene);
      
      // 根据服务器代码，场景数据结构应该是 { scene: SceneConfig, rtc: RTCConfig }
      if (firstScene.scene && firstScene.rtc) {
        currentScene.value = firstScene.scene.id;
        rtcConfig.value = firstScene.rtc;
        console.log('设置场景ID:', currentScene.value);
        console.log('设置RTC配置:', rtcConfig.value);
        return firstScene;
      }
    }
    
    throw new Error('没有可用的场景配置');
  } catch (error) {
    console.error('获取场景配置失败:', error);
    message.error('获取场景配置失败: ' + error.message);
    throw error;
  }
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

const initRTCClient = async () => {
  if (client.value) {
    console.log('RTC客户端已存在，跳过初始化');
    return;
  }

  try {
    console.log('开始初始化RTC客户端...');
    
    // 加载RTC SDK
    const sdkLoaded = await loadRTCLibrary();
    
    // 获取场景配置
    const sceneConfig = await getScenes();
    console.log('获取到的场景配置:', sceneConfig);
    
    // 检查设备权限
  isMobileDevice.value = isMobile();
    console.log('是否为移动设备:', isMobileDevice.value);
    
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' });
      console.log('麦克风权限状态:', permission.state);
      if (permission.state === 'denied') {
        throw new Error('需要麦克风访问权限');
      }
    } catch (permError) {
      console.warn('无法检查麦克风权限:', permError);
      // 继续执行，不阻止初始化
    }

    // 初始化RTC客户端
    client.value = {
      sceneConfig,
      rtcConfig: rtcConfig.value,
      isConnected: false,
      sdkLoaded
    };
    
    console.log('RTC客户端初始化成功，客户端对象:', client.value);
    connectStatus.value = 'ready';
    
  } catch (error) {
    console.error('初始化RTC客户端失败:', error);
    message.error('初始化失败: ' + error.message);
    throw error;
  }
};

// 格式化消息时间
const formatMessageTime = (index) => {
  if (messageTimestamps.value[index]) {
    return messageTimestamps.value[index];
  }
  return new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

// 模拟连接模式
const handleSimulatedConnect = async () => {
  try {
    console.log('模拟RTC连接流程...');
    
    // 模拟连接延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 调用RTC StartVoiceChat API
    const response = await fetch(`${RTC_PROXY_HOST}/proxy?Action=StartVoiceChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        SceneID: currentScene.value
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('模拟AIGC代理启动成功:', result);
    
    isConnected.value = true;
    audioBotEnabled.value = true;
    connectStatus.value = 'connected';
    isConnecting.value = false;
    
    // 添加连接成功的消息
    messageList.value.push('AI助手已连接（模拟模式），开始对话...');
          messageTimestamps.value.push(
            new Date().toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })
          );
    
    message.success('模拟连接成功！注意：这是模拟模式，实际通话功能需要RTC SDK');
    
  } catch (error) {
    isConnecting.value = false;
    console.error('模拟连接失败:', error);
    message.error('模拟连接失败: ' + error.message);
  }
};

// RTC事件监听器
const addRTCEventListeners = () => {
  if (!rtcEngine.value) return;
  
  console.log('添加RTC事件监听器...');
  console.log('VERTC events:', VERTC.events);
  
  // 错误处理
  if (VERTC.events?.onError) {
    rtcEngine.value.on(VERTC.events.onError, (error) => {
      console.error('RTC错误:', error);
      message.error('RTC连接错误: ' + error.errorCode);
    });
  }
  
  // 用户加入
  if (VERTC.events?.onUserJoined) {
    rtcEngine.value.on(VERTC.events.onUserJoined, (event) => {
      console.log('用户加入房间:', event);
      // 只在字幕中显示，不在消息列表中重复显示
      if (subtitleEnabled.value) {
        addSubtitle(`用户 ${event.userId} 加入房间`, 'AI', true);
      }
    });
  }
  
  // 用户离开
  if (VERTC.events?.onUserLeave) {
    rtcEngine.value.on(VERTC.events.onUserLeave, (event) => {
      console.log('用户离开房间:', event);
      // 只在字幕中显示，不在消息列表中重复显示
      if (subtitleEnabled.value) {
        addSubtitle(`用户 ${event.userId} 离开房间`, 'AI', true);
      }
    });
  }
  
  // 音频属性报告
  if (VERTC.events?.onLocalAudioPropertiesReport) {
    rtcEngine.value.on(VERTC.events.onLocalAudioPropertiesReport, (event) => {
      // 可以用于显示音量指示器
      console.log('本地音频属性:', event);
    });
  }
  
  // 远程音频属性报告
  if (VERTC.events?.onRemoteAudioPropertiesReport) {
    rtcEngine.value.on(VERTC.events.onRemoteAudioPropertiesReport, (event) => {
      // 可以用于显示远程用户音量
      console.log('远程音频属性:', event);
    });
  }
  
  // 语音识别事件 - 处理AI语音转文字
  if (VERTC.events?.onAudioVolumeIndication) {
    rtcEngine.value.on(VERTC.events.onAudioVolumeIndication, (speakers, totalVolume) => {
      console.log('音频音量指示:', { speakers, totalVolume });
    });
  }
  
  // 处理AIGC消息事件 - 二进制消息（字幕）
  if (VERTC.events?.onRoomBinaryMessageReceived) {
    rtcEngine.value.on(VERTC.events.onRoomBinaryMessageReceived, (event) => {
      console.log('收到RTC二进制消息:', event);
      try {
        // 解析二进制消息
        const messageBuffer = event.message;
        const messageText = new TextDecoder().decode(messageBuffer);
        console.log('解析的消息文本:', messageText);
        
        // 使用新的消息解析函数
        const messageData = parseRTCMessage(messageText);
        
        // 如果解析结果为null（被过滤的JSON数据），直接返回
        if (!messageData) {
          console.log('消息被过滤，不进行处理');
          return;
        }
        
        // 处理字幕消息
        if (messageData && (messageData.type === 'subv' || messageData.data || messageData.text)) {
          let subtitleData = null;
          
          if (messageData.data && messageData.data.length > 0) {
            subtitleData = messageData.data[0];
          } else if (messageData.text && messageData.type !== 'subtitle') {
            subtitleData = messageData;
          }
          
          if (subtitleData) {
            const { text, definite, userId: user, paragraph, language, mode } = subtitleData;
            
            if (text && typeof text === 'string' && text.trim()) {
              // 过滤掉包含JSON格式的原始数据
              if (text.includes('"data"') || text.includes('"type"') || text.includes('"subtitle"')) {
                console.log('过滤掉原始JSON数据，不显示为字幕');
                return;
              }
              
              // 解码Unicode字符
              let decodedText = text;
              try {
                // 处理Unicode编码的中文字符
                if (text.includes('\\u')) {
                  decodedText = JSON.parse('"' + text + '"');
                }
              } catch (decodeError) {
                console.log('Unicode解码失败，使用原始文本:', decodeError.message);
              }
              
              console.log('收到字幕:', { 
                text: decodedText, 
                definite, 
                user, 
                paragraph, 
                language, 
                mode 
              });
              
              // 添加字幕
              if (subtitleEnabled.value) {
                // 根据userId判断是用户还是AI
                const speaker = (user === 'ChatBot01' || user === 'AI') ? 'AI' : 'User';
                addSubtitle(decodedText, speaker, definite !== false);
              }
              
              // 如果是确定的字幕，也添加到对话列表
              if (definite !== false) {
                const speaker = (user === 'ChatBot01' || user === 'AI') ? 'AI面试官' : '您';
                messageList.value.push(decodedText);
                messageTimestamps.value.push(
                  new Date().toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })
                );
              }
            }
          }
        }
        
        // 处理状态消息
        if (messageData && (messageData.type === 'conv' || messageData.Stage)) {
          const { Stage } = messageData;
          const { Code, Description } = Stage || {};
          console.log('收到状态消息:', { Code, Description });
          
          // 根据状态更新UI
          switch (Code) {
            case 2: // THINKING
              console.log('AI正在思考...');
              break;
            case 3: // SPEAKING
              console.log('AI正在说话...');
              break;
            case 4: // FINISHED
              console.log('AI说话完成');
              break;
            case 5: // INTERRUPTED
              console.log('AI被中断');
              break;
          }
        }
        
      } catch (error) {
        console.error('解析RTC消息失败:', error);
        console.log('原始消息:', event.message);
        
        // 即使解析失败，也尝试添加一些字幕内容（但要过滤JSON数据）
        try {
          const messageText = new TextDecoder().decode(event.message);
          if (messageText && messageText.trim()) {
            // 过滤掉包含JSON格式的原始数据
            if (messageText.includes('"data"') || messageText.includes('"type"') || messageText.includes('"subtitle"') || messageText.startsWith('subv{')) {
              console.log('过滤掉原始JSON数据，不作为字幕显示');
              return;
            }
            
            console.log('使用原始消息作为字幕:', messageText);
            if (subtitleEnabled.value) {
              addSubtitle(messageText, 'AI', true);
            }
          }
        } catch (fallbackError) {
          console.error('备用字幕处理也失败:', fallbackError);
        }
    }
  });
  }
  
  // 处理普通消息事件（备用）
  if (VERTC.events?.onMessageReceived) {
    rtcEngine.value.on(VERTC.events.onMessageReceived, (event) => {
      console.log('收到普通消息:', event);
      if (event.message && event.message.text) {
        // 添加AI消息到对话列表
        messageList.value.push(event.message.text);
        messageTimestamps.value.push(
          new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })
        );
        
        // 添加字幕
        if (subtitleEnabled.value) {
          addSubtitle(event.message.text, 'AI', true);
        }
      }
    });
  }
  
  // 处理语音识别事件
  if (VERTC.events?.onAudioVolumeIndication) {
    rtcEngine.value.on(VERTC.events.onAudioVolumeIndication, (speakers, totalVolume) => {
      console.log('音频音量指示:', { speakers, totalVolume });
      
      // 检测用户说话
      if (speakers && speakers.length > 0) {
        const userSpeaker = speakers.find(s => s.userId !== rtcConfig.value?.UserId);
        if (userSpeaker && userSpeaker.volume > 10) {
          console.log('检测到用户说话，音量:', userSpeaker.volume);
          // 这里可以添加用户说话时的处理逻辑
        }
      }
    });
  }
  
  // 处理连接状态变化
  if (VERTC.events?.onConnectionStateChanged) {
    rtcEngine.value.on(VERTC.events.onConnectionStateChanged, (state, reason) => {
      console.log('RTC连接状态变化:', { state, reason });
      connectStatus.value = state;
      
      if (state === 'CONNECTED' || state === 3) {
        console.log('RTC连接成功');
        message.success('RTC连接已建立');
      } else if (state === 'DISCONNECTED' || state === 0) {
        console.log('RTC连接断开');
        message.warning('RTC连接已断开');
      }
    });
  }
  
  // 网络质量
  if (VERTC.events?.onNetworkQuality) {
    rtcEngine.value.on(VERTC.events.onNetworkQuality, (uplink, downlink) => {
      console.log('网络质量:', { uplink, downlink });
    });
  }
  
  // 模拟实时字幕更新（实际项目中应该从RTC SDK获取）
  if (isConnected.value) {
    // 模拟AI说话的字幕
    setTimeout(() => {
      if (subtitleEnabled.value && isConnected.value) {
        addSubtitle('您好，我是AI面试官，很高兴见到您。', 'AI', true);
      }
    }, 3000);
    
    // 模拟实时字幕更新
    const subtitleInterval = setInterval(() => {
      if (!isConnected.value || !subtitleEnabled.value) {
        clearInterval(subtitleInterval);
        return;
      }
      
      // 模拟实时字幕内容
      const mockSubtitles = [
        '请简单介绍一下您的技术背景',
        '请详细说明一下您在项目中遇到的技术难点',
        '您对团队协作有什么看法？',
        '请谈谈您对新技术的学习能力'
      ];
      
      const randomSubtitle = mockSubtitles[Math.floor(Math.random() * mockSubtitles.length)];
      addSubtitle(randomSubtitle, 'AI', false);
      
      // 3秒后完成字幕
      setTimeout(() => {
        if (isConnected.value && subtitleEnabled.value) {
          completeSubtitle();
        }
      }, 3000);
    }, 8000);
  }
};

// RTC消息处理函数
const handleRTCMessage = (message) => {
  console.log('收到RTC消息:', message);
  // 这里可以添加RTC消息处理逻辑
};

const handleRTCConnect = async () => {
  if (isConnecting.value) {
    console.log('正在连接中，忽略重复点击');
    return;
  }
  
  isConnecting.value = true;
  console.log('用户点击通话按钮，开始连接流程');
  
  try {
    await handleConnect();
  } catch (error) {
    console.error('连接失败:', error);
    isConnecting.value = false;
  }
};

const handleConnect = async () => {
  try {
    if (!client.value) {
      await initRTCClient();
    }

    // 如果SDK未加载，提示用户
    if (!client.value.sdkLoaded) {
      console.error('RTC SDK未加载，无法建立完整连接');
      message.error('RTC SDK未正确加载，请检查依赖配置');
      isConnecting.value = false;
      return;
    }

    // 创建RTC引擎
    console.log('创建RTC引擎...');
    rtcEngine.value = VERTC.createEngine(rtcConfig.value.AppId);
    
    // 注册AI降噪扩展
    try {
      const AIAnsExtension = new RTCAIAnsExtension();
      await rtcEngine.value.registerExtension(AIAnsExtension);
      AIAnsExtension.enable();
      console.log('AI降噪扩展已启用');
  } catch (error) {
      console.warn('AI降噪扩展加载失败，继续执行:', error);
    }

    // 添加事件监听器
    addRTCEventListeners();

    // 加入房间
    console.log('加入RTC房间...');
    console.log('VERTC对象:', VERTC);
    console.log('RoomProfileType:', VERTC.RoomProfileType);
    
    // 使用正确的房间配置
    const roomConfig = {
      isAutoPublish: true,
      isAutoSubscribeAudio: true,
      roomProfileType: VERTC.RoomProfileType?.chat || 0, // 使用默认值
    };
    
    console.log('房间配置:', roomConfig);
    
    await rtcEngine.value.joinRoom(
      rtcConfig.value.Token,
      rtcConfig.value.RoomId,
      {
        userId: rtcConfig.value.UserId,
        extraInfo: JSON.stringify({
          call_scene: 'RTC-AIGC',
          user_name: rtcConfig.value.UserId,
          user_id: rtcConfig.value.UserId,
        }),
      },
      roomConfig
    );

    // 启动音频捕获
    console.log('启动音频捕获...');
    await rtcEngine.value.startAudioCapture();

    // 发布音频流
    console.log('发布音频流...');
    console.log('MediaType:', VERTC.MediaType);
    rtcEngine.value.publishStream(VERTC.MediaType?.AUDIO || 1); // 使用默认值

    // 调用RTC StartVoiceChat API
    console.log('启动AIGC代理...');
    const response = await fetch(`${RTC_PROXY_HOST}/proxy?Action=StartVoiceChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        SceneID: currentScene.value
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('AIGC代理启动成功:', result);
    
    if (result.ResponseMetadata && result.ResponseMetadata.Error) {
      throw new Error(result.ResponseMetadata.Error.Message);
    }

    isConnected.value = true;
    audioBotEnabled.value = true;
    connectStatus.value = 'connected';
    isConnecting.value = false;
    
    // 添加连接成功的消息
    messageList.value.push('AI助手已连接，开始对话...');
    messageTimestamps.value.push(
      new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    );
    
    // 清空字幕历史
    clearSubtitleHistory();
    
    // 添加初始字幕
    if (subtitleEnabled.value) {
      console.log('连接成功后添加初始字幕');
      addSubtitle('AI助手已连接，可以开始对话了', 'AI', true);
      
      // 延迟添加更多测试字幕
      setTimeout(() => {
        if (subtitleEnabled.value && isConnected.value) {
          addSubtitle('请简单介绍一下您的技术背景', 'AI', true);
        }
      }, 2000);
      
      setTimeout(() => {
        if (subtitleEnabled.value && isConnected.value) {
          addSubtitle('您对团队协作有什么看法？', 'AI', true);
        }
      }, 4000);
    }
    
    message.success('RTC连接成功！可以开始通话了');
    
  } catch (error) {
    isConnecting.value = false;
    console.error('RTC连接失败:', error);
    message.error('连接失败: ' + error.message);
    
    // 清理资源
    await safeCleanupRTCEngine();
    
    // 重置状态
    isConnected.value = false;
    audioBotEnabled.value = false;
    connectStatus.value = 'disconnected';
  }
};

const handleInterrupt = () => {
  try {
    // RTC打断功能
    message.info('打断功能已触发');
  } catch (error) {
    message.error('打断失败：' + error);
  }
};

const handleDisconnect = async () => {
  try {
    console.log('开始断开RTC连接...');
    
    // 停止AIGC代理
    if (audioBotEnabled.value && currentScene.value) {
      console.log('停止AIGC代理...');
      try {
        const response = await fetch(`${RTC_PROXY_HOST}/proxy?Action=StopVoiceChat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            SceneID: currentScene.value,
            AppId: rtcConfig.value?.AppId,
            RoomId: rtcConfig.value?.RoomId,
            TaskId: rtcConfig.value?.TaskId || 'default'
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('AIGC代理停止成功:', result);
        }
      } catch (aigcError) {
        console.warn('停止AIGC代理失败:', aigcError);
        // 继续执行，不阻止断开流程
      }
    }
    
    // 清理RTC引擎
    await safeCleanupRTCEngine();
    
    // 重置状态
    isConnected.value = false;
    audioBotEnabled.value = false;
    connectStatus.value = 'disconnected';
    isConnecting.value = false;
    
    // 清理字幕状态
    currentSubtitle.value = '';
    isSubtitleLoading.value = false;
    
    // 添加断开连接的消息
    messageList.value.push('已断开连接');
    messageTimestamps.value.push(
      new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    );
    
    // 添加断开连接的字幕
    if (subtitleEnabled.value) {
      addSubtitle('已断开连接', 'AI', true);
    }
    
    message.success('已断开连接');
    
    // 注意：不要在这里调用handleEndInterview，避免重复分析
    // 分析应该在用户主动结束面试时进行
    
  } catch (error) {
    console.error('断开失败:', error);
    message.error('断开失败：' + error.message);
    
    // 即使出错也要重置状态
    isConnected.value = false;
    audioBotEnabled.value = false;
    connectStatus.value = 'disconnected';
    isConnecting.value = false;
    rtcEngine.value = null;
  }
};

// 检查RTC引擎状态
const getRTCEngineState = () => {
  if (!rtcEngine.value) return 'NOT_CREATED';
  
  try {
    const state = rtcEngine.value.getConnectionState?.();
    return state || 'UNKNOWN';
  } catch (error) {
    console.warn('获取RTC引擎状态失败:', error);
    return 'ERROR';
  }
};

// 安全清理RTC引擎
const safeCleanupRTCEngine = async () => {
  if (!rtcEngine.value || !VERTC) return;
  
  try {
    const state = getRTCEngineState();
    console.log('清理前的RTC引擎状态:', state);
    
    // 只有在连接状态下才执行清理操作
    if (state === 'CONNECTED' || state === 3) {
      try {
        await rtcEngine.value.stopAudioCapture();
        console.log('音频捕获已停止');
      } catch (error) {
        console.warn('停止音频捕获失败:', error);
      }
      
      try {
        rtcEngine.value.unpublishStream(VERTC.MediaType?.AUDIO || 1);
        console.log('音频流已取消发布');
      } catch (error) {
        console.warn('取消发布音频流失败:', error);
      }
      
      try {
        await rtcEngine.value.leaveRoom();
        console.log('已离开房间');
      } catch (error) {
        console.warn('离开房间失败:', error);
      }
    }
    
    // 销毁引擎
    try {
      VERTC.destroyEngine(rtcEngine.value);
      console.log('RTC引擎已销毁');
    } catch (error) {
      console.warn('销毁RTC引擎失败:', error);
    }
    
    rtcEngine.value = null;
  } catch (error) {
    console.error('安全清理RTC引擎失败:', error);
    rtcEngine.value = null;
  }
};

// 字幕相关状态
const subtitleHistory = ref([]);
const currentSubtitle = ref('');
const isSubtitleLoading = ref(false);

// RTC消息解析工具函数
const parseRTCMessage = (messageText) => {
  console.log('开始解析RTC消息:', messageText);
  
  // 1. 尝试标准JSON解析
  try {
    const jsonData = JSON.parse(messageText);
    console.log('标准JSON解析成功:', jsonData);
    return jsonData;
  } catch (jsonError) {
    console.log('标准JSON解析失败:', jsonError.message);
  }
  
  // 2. 处理特殊格式消息
  if (messageText.startsWith('subv')) {
    console.log('检测到字幕格式消息');
    
    // 匹配 subv{内容} 格式（可能包含特殊字符）
    const subtitleMatch = messageText.match(/subv\s*\{([\s\S]*)\}/);
    if (subtitleMatch) {
      const content = subtitleMatch[1];
      console.log('提取的字幕内容:', content);
      
      // 尝试解析字幕内容
      try {
        const subtitleData = JSON.parse(content);
        console.log('字幕数据解析成功:', subtitleData);
        return subtitleData;
      } catch (subtitleError) {
        console.log('字幕内容JSON解析失败，过滤原始JSON内容:', subtitleError.message);
        // 不返回原始JSON内容，避免显示乱码
        return null;
      }
    }
  }
  
  // 3. 处理conv格式消息
  if (messageText.startsWith('conv')) {
    console.log('检测到对话格式消息');
    
    // 匹配 conv{内容} 格式
    const convMatch = messageText.match(/conv\s*\{([\s\S]*)\}/);
    if (convMatch) {
      const content = convMatch[1];
      console.log('提取的对话内容:', content);
      
      try {
        const convData = JSON.parse(content);
        console.log('对话数据解析成功:', convData);
        return convData;
      } catch (convError) {
        console.log('对话内容JSON解析失败:', convError.message);
        return { 
          type: 'conv', 
          content: content
        };
      }
    }
  }
  
  // 4. 处理其他格式
  if (messageText.includes('{') && messageText.includes('}')) {
    // 尝试提取JSON部分
    const jsonMatch = messageText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        console.log('提取的JSON数据:', jsonData);
        return jsonData;
      } catch (extractError) {
        console.log('提取的JSON解析失败:', extractError.message);
      }
    }
  }
  
  // 4. 过滤原始JSON文本，避免显示乱码
  if (messageText.includes('"data"') || messageText.includes('"type"') || messageText.includes('"subtitle"') || messageText.startsWith('subv{')) {
    console.log('过滤掉原始JSON数据，不作为消息返回');
    return null;
  }
  
  // 5. 使用原始文本（仅当不包含JSON格式时）
  console.log('使用原始文本作为消息');
  return { 
    type: 'unknown', 
    text: messageText,
    definite: true,
    userId: 'AI'
  };
};

// 字幕切换处理
const handleSubtitleToggle = (checked) => {
  subtitleEnabled.value = checked;
  console.log('字幕状态切换:', checked);
  
  if (checked) {
    message.success('字幕已开启');
  } else {
    message.info('字幕已关闭');
  }
};

// 添加字幕内容
const addSubtitle = (text, user = 'AI', isComplete = false) => {
  console.log('添加字幕:', { text, user, isComplete, subtitleEnabled: subtitleEnabled.value });
  
  if (!subtitleEnabled.value) {
    console.log('字幕功能已关闭，跳过添加');
    return;
  }
  
  const timestamp = new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  if (isComplete) {
    // 完成一句话，添加到历史记录
    const subtitleItem = {
      id: Date.now() + Math.random(), // 确保ID唯一
      text,
      user,
      timestamp,
      isComplete: true
    };
    subtitleHistory.value.push(subtitleItem);
    currentSubtitle.value = '';
    isSubtitleLoading.value = false;
    console.log('字幕已添加到历史记录:', subtitleItem);
    console.log('当前字幕历史数量:', subtitleHistory.value.length);
    
    // 强制更新视图
    nextTick(() => {
      console.log('字幕视图已更新，当前字幕历史:', subtitleHistory.value);
    });
  } else {
    // 实时更新当前字幕
    currentSubtitle.value = text;
    isSubtitleLoading.value = true;
    console.log('更新当前字幕:', text);
  }
};

// 完成当前字幕
const completeSubtitle = () => {
  if (currentSubtitle.value) {
    addSubtitle(currentSubtitle.value, 'AI', true);
    isSubtitleLoading.value = false;
  }
};

// 清空字幕历史
const clearSubtitleHistory = () => {
  subtitleHistory.value = [];
  currentSubtitle.value = '';
  isSubtitleLoading.value = false;
};

const handleEndInterview = async () => {
  try {
    console.log('开始结束面试流程...');
    
    // 如果还在连接中，先断开连接
    if (isConnected.value) {
      await handleDisconnect();
      // 等待断开连接完成后再分析
      setTimeout(async () => {
    await analyzeInterviewData();
      }, 1000);
    } else {
      // 如果已经断开连接，直接分析
      await analyzeInterviewData();
    }
  } catch (error) {
    console.error('结束面试失败:', error);
    message.error('结束面试失败：' + error.message);
  }
};

// 分析面试数据的函数
const analyzeInterviewData = async () => {
  try {
    // 显示分析中的消息
    message.loading('正在分析面试记录...', 0);
    
    // 如果聊天记录为空，添加一些模拟的对话内容
    let chatHistory = messageList.value;
    if (!chatHistory || chatHistory.length === 0) {
      console.log('聊天记录为空，使用模拟数据');
      chatHistory = [
        '您好，我是AI面试官，很高兴见到您。',
        '您好，我是应聘者，很高兴参加这次面试。',
        '请简单介绍一下您的技术背景和工作经验。',
        '我有3年的前端开发经验，主要使用Vue.js和React技术栈，参与过多个大型项目的开发。',
        '很好，请详细说明一下您在项目中遇到的技术难点以及解决方案。',
        '在最近的项目中，我遇到了大数据量渲染的性能问题，通过虚拟滚动和懒加载技术成功优化了页面性能。',
        '您的回答很专业，请问您对团队协作有什么看法？',
        '我认为团队协作是项目成功的关键，我习惯使用Git进行版本控制，积极参与代码评审，乐于分享技术经验。'
      ];
    }
    
    console.log('准备分析的聊天记录:', chatHistory);
    
    // 准备分析参数
    const analysisParams = {
      chatHistory: chatHistory,
      domain: props.selectedDomainName,
      role: props.selectedRole,
      useStaticData: false,
      includeMultimodal: false
    };
    
    // 使用新的分析完成处理函数
    await handleAnalysisComplete(analysisParams);
    
  } catch (error) {
    message.destroy();
    message.error('分析面试记录失败：' + error.message);
    console.error('分析错误:', error);
  }
};

const toggleMicrophone = () => {
  try {
    audioEnabled.value = !audioEnabled.value;
    
    if (rtcEngine.value && client.value.sdkLoaded) {
      // 实际的RTC静音控制
      if (audioEnabled.value) {
        rtcEngine.value.startAudioCapture();
        rtcEngine.value.publishStream(VERTC.MediaType?.AUDIO || 1);
        message.success('已取消静音');
      } else {
        rtcEngine.value.stopAudioCapture();
        rtcEngine.value.unpublishStream(VERTC.MediaType?.AUDIO || 1);
        message.success('已静音');
      }
    } else {
      // 模拟模式
      message.info(audioEnabled.value ? '已取消静音（模拟）' : '已静音（模拟）');
    }
  } catch (error) {
    console.error('切换麦克风状态失败:', error);
    message.error('切换麦克风状态失败：' + error.message);
  }
};

// 检查浏览器支持
const checkBrowserSupport = () => {
  browserSupport.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// 检查权限状态
const checkPermissionStatus = async () => {
  try {
    if (!browserSupport.value) {
      permissionStatus.value = '浏览器不支持';
      return;
    }
    
    const result = await navigator.permissions.query({ name: 'camera' });
    permissionStatus.value = result.state;
  } catch (error) {
    permissionStatus.value = '无法检查权限';
  }
};

// 开启摄像头
const enableCamera = async () => {
  if (fullscreenCameraRef.value) {
    isCameraLoading.value = true;
    const success = await fullscreenCameraRef.value.enableCamera();
    if (success) {
      isCameraEnabled.value = true;
    }
    isCameraLoading.value = false;
  }
};

// 关闭摄像头
const disableCamera = () => {
  if (fullscreenCameraRef.value) {
    fullscreenCameraRef.value.disableCamera();
    isCameraEnabled.value = false;
  }
};

// 处理摄像头状态变化事件
const handleCameraStatusChanged = (enabled) => {
  isCameraEnabled.value = enabled;
};

// 切换摄像头
const toggleCamera = async () => {
  if (fullscreenCameraRef.value) {
    await fullscreenCameraRef.value.toggleCamera();
  }
};

// 测试功能
const addTestMessage = () => {
  const testMessages = [
    '您好，我是AI面试官，很高兴见到您。',
    '您好，我是应聘者，很高兴参加这次面试。',
    '请简单介绍一下您的技术背景和工作经验。',
    '我有3年的前端开发经验，主要使用Vue.js和React技术栈。',
    '很好，请详细说明一下您在项目中遇到的技术难点。',
    '在最近的项目中，我遇到了大数据量渲染的性能问题。'
  ];
  
  const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
  messageList.value.push(randomMessage);
  messageTimestamps.value.push(
    new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  );
  console.log('添加测试消息:', randomMessage);
  message.success('已添加测试消息');
};

// 测试字幕功能
const addTestSubtitle = () => {
  console.log('测试字幕功能被调用');
  console.log('当前字幕状态:', {
    subtitleEnabled: subtitleEnabled.value,
    subtitleHistoryLength: subtitleHistory.value.length,
    currentSubtitle: currentSubtitle.value,
    isSubtitleLoading: isSubtitleLoading.value
  });
  
  if (!subtitleEnabled.value) {
    message.warning('请先开启字幕功能');
    return;
  }
  
  const testSubtitles = [
    '这是一个测试字幕内容',
    'AI面试官正在说话...',
    '请回答下一个问题',
    '您的回答很专业'
  ];
  
  const randomSubtitle = testSubtitles[Math.floor(Math.random() * testSubtitles.length)];
  addSubtitle(randomSubtitle, 'AI', true);
  
  console.log('添加测试字幕:', randomSubtitle);
  message.success('测试字幕已添加');
  
  // 延迟显示更新后的状态
  setTimeout(() => {
    console.log('字幕添加后的状态:', {
      subtitleHistoryLength: subtitleHistory.value.length,
      currentSubtitle: currentSubtitle.value,
      isSubtitleLoading: isSubtitleLoading.value
    });
  }, 100);
};

const clearMessages = () => {
  messageList.value = [];
  messageTimestamps.value = [];
  console.log('清空所有消息');
  message.success('已清空所有消息');
};

const showMessageCount = () => {
  console.log('当前消息数量:', messageList.value.length);
  console.log('消息内容:', messageList.value);
  message.info(`当前有 ${messageList.value.length} 条消息`);
};

// 修改分析完成处理函数
const handleAnalysisComplete = async (analysisParams) => {
  try {
    message.loading('正在分析面试记录...', 0);
    
    console.log('开始分析面试记录:', analysisParams);
    
    // 调用星火API进行分析
    const result = await analyzeInterview(analysisParams);
    
    console.log('分析完成，结果:', result);
    
    // 关闭加载消息
    message.destroy();
    message.success('面试分析完成！');
    
    // 直接设置分析结果，不发送事件
    analysisResult.value = result;
    showAnalysisResult.value = true;
    
    console.log('分析结果已设置，显示结果页面');
    
  } catch (error) {
    message.destroy();
    message.error('分析面试记录失败：' + error.message);
    console.error('分析错误:', error);
  }
};

// 返回面试页面
const backToInterview = () => {
  showAnalysisResult.value = false;
  analysisResult.value = null;
  console.log('返回面试页面');
};

// 修改测试分析完成函数
const testAnalysisComplete = () => {
  console.log('测试分析完成事件');
  const mockAnalysisResult = {
    feedbackData: {
      keyIssues: ['测试问题1', '测试问题2'],
      improvementSuggestions: ['测试建议1', '测试建议2']
    },
    radarChartScores: [85, 80, 75, 90, 70],
    learningRecommendations: {
      professional_knowledge: [
        '深入学习Vue.js源码和原理',
        '掌握前端性能优化技术'
      ],
      language_expression: [
        '参加技术分享会，提高表达能力',
        '学习结构化面试技巧'
      ]
    }
  };
  
  console.log('设置测试分析结果:', mockAnalysisResult);
  analysisResult.value = mockAnalysisResult;
  showAnalysisResult.value = true;
  message.success('已显示测试分析结果');
};

// 虚拟面试官事件处理
const handleExpressionChanged = (expression) => {
  currentExpression.value = expression;
  console.log('虚拟面试官表情变化:', expression);
};

const handleGesturePlayd = (gesture) => {
  lastGesture.value = gesture;
  console.log('虚拟面试官手势:', gesture);
};

onMounted(async () => {
  // 检查摄像头支持
  checkBrowserSupport();
  checkPermissionStatus();
  
  // 不自动初始化RTC客户端，等用户点击连接时再初始化
  console.log('组件挂载完成，等待用户操作');
});

onUnmounted(async () => {
  console.log('RealtimeInterview组件即将卸载，清理资源...');
  
  // 如果还在连接中，先断开连接
  if (isConnected.value || isConnecting.value) {
    try {
      await handleDisconnect();
    } catch (error) {
      console.error('组件卸载时断开连接失败:', error);
    }
  }
  
  // 确保RTC引擎被清理
  await safeCleanupRTCEngine();
  
  console.log('RealtimeInterview组件资源清理完成');
});
</script>

<style scoped>
/* 3D虚拟面试官区域样式 */
.virtual-interviewer-section {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 500px;
  height: 400px;
  z-index: 5;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

@media (max-width: 768px) {
  .virtual-interviewer-section {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    height: 350px;
    margin-bottom: 20px;
  }
  
  .interview-controls {
    position: relative;
    top: auto;
    left: auto;
    max-width: 100%;
    margin-bottom: 20px;
  }
  
  .conversation-display {
    position: relative;
    top: auto;
    right: auto;
    bottom: auto;
    width: 100%;
    max-width: 100%;
    height: 400px;
  }
}

/* 面试控制面板样式 */
.interview-controls {
  position: absolute;
  top: 440px;
  left: 20px;
  z-index: 10;
  max-width: 500px;
}

.control-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.interview-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.interview-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
}

.domain-text, .role-text {
  font-weight: 600;
  color: #1890ff;
}

/* 区域标题样式 */
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* 摄像头控制区域 */
.camera-control-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.camera-control-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.camera-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.camera-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.camera-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.enable-btn {
  background: rgba(82, 196, 26, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.disable-btn {
  background: rgba(255, 77, 79, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toggle-btn {
  background: rgba(24, 144, 255, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.camera-status-info {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
}

.status-value {
  font-size: 11px;
  color: #999;
  font-weight: 600;
}

.status-value.active {
  color: #52c41a;
}

/* 语音控制区域 */
.voice-control-section {
  margin-bottom: 16px;
}

/* AI助手卡片样式 */
.ai-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.ai-avatar {
  text-align: center;
  margin-bottom: 16px;
}

.ai-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.ai-title {
  text-align: center;
  margin-bottom: 16px;
}

.ai-title > div:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.ai-desc {
  font-size: 12px;
  color: #666;
}

.ai-scene-container {
  display: flex;
  justify-content: center;
}

.ai-scene-wrapper {
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 12px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-scene-wrapper:hover {
  background: rgba(24, 144, 255, 0.15);
  transform: translateY(-1px);
}

.ai-scene-active {
  background: rgba(24, 144, 255, 0.2);
  border-color: #1890ff;
}

.ai-scene-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-scene-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.ai-scene-text {
  font-size: 12px;
  font-weight: 500;
  color: #1890ff;
}

/* 通话控制区域样式 */
.call-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

/* 通话按钮样式 */
.invoke-button-wrapper {
  display: flex;
  justify-content: center;
}

.invoke-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.invoke-button:hover {
  transform: scale(1.05);
}

.invoke-button.invoke-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.invoke-btn {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.invoke-btn:hover {
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.invoke-btn img {
  width: 48px;
  height: 48px;
}

.invoke-icon {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.invoke-loading-icon {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.invoke-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 通话控制区域样式 */
.call-controls {
  margin-bottom: 16px;
}

.call-buttons-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 挂断按钮样式 */
.leave-button-wrapper {
  display: flex;
  justify-content: center;
}

.leave-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.leave-button:hover {
  transform: scale(1.05);
}

.leave-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 6px 24px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.leave-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(255, 107, 107, 0.4);
}

.leave-icon {
  width: 20px;
  height: 20px;
}

.leave-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

/* 结束面试按钮样式 */
.end-interview-button-wrapper {
  display: flex;
  justify-content: center;
}

.end-interview-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.end-interview-button:hover {
  transform: scale(1.05);
}

.end-interview-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 6px 24px rgba(114, 46, 209, 0.3);
  transition: all 0.3s ease;
}

.end-interview-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(114, 46, 209, 0.4);
}

.end-interview-icon {
  width: 20px;
  height: 20px;
}

.end-interview-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}



.connection-status {
  text-align: center;
  font-size: 12px;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 8px;
}

.connection-status p {
  margin: 0;
}

/* 测试功能区域 */
.test-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.test-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.test-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.test-buttons .ant-btn {
  font-size: 10px;
  padding: 2px 6px;
  height: auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 对话显示区域样式 */
.conversation-display {
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 80px;
  z-index: 10;
  width: 400px;
  max-width: 400px;
}

.conversation-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
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

.conversation-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.subtitle-toggle-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

.subtitle-label {
  font-size: 12px;
  font-weight: 500;
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
  flex: 1;
  overflow-y: auto;
  min-height: 0;
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

/* 字幕部分样式 */
.subtitle-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.subtitle-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.subtitle-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 6px;
}

.subtitle-section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: #667eea;
  border-radius: 2px;
}

.subtitle-item {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-left: 3px solid transparent;
  margin-bottom: 8px;
}

.subtitle-item.ai-subtitle {
  border-left-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.subtitle-item.user-subtitle {
  border-left-color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.subtitle-user {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
}

.subtitle-text {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  word-wrap: break-word;
}

.subtitle-time {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
}

.current-subtitle {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-left: 3px solid #667eea;
  border: 1px dashed rgba(102, 126, 234, 0.3);
  margin-top: 8px;
}

.subtitle-loading {
  color: #667eea;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
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

/* 返回按钮样式 */
.back-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-controls {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .conversation-display {
    position: relative;
    top: auto;
    right: auto;
    bottom: auto;
    width: 100%;
    max-width: none;
    margin-top: 20px;
  }
  
  .conversation-container {
    height: 300px;
  }
  
  .control-panel {
    padding: 12px;
  }
  
  .interview-title {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 12px;
  }
  
  .camera-control-buttons {
    gap: 6px;
  }
  
  .camera-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .camera-status-info {
    padding: 6px;
  }
  
  .status-label, .status-value {
    font-size: 10px;
  }
  
  /* 通话控制区域移动端样式 */
  .call-controls {
    gap: 12px;
    margin-bottom: 16px;
  }
  
  /* 通话按钮移动端样式 */
  .invoke-btn {
    width: 64px;
    height: 64px;
  }
  
  .invoke-btn img {
    width: 36px;
    height: 36px;
  }
  
  .invoke-icon {
    width: 20px;
    height: 20px;
  }
  
  .invoke-loading-icon {
    width: 20px;
    height: 20px;
  }
  
  .invoke-text {
    font-size: 12px;
  }
  
  /* 挂断按钮移动端样式 */
  .leave-btn {
    width: 48px;
    height: 48px;
  }
  
  .leave-icon {
    width: 16px;
    height: 16px;
  }
  
  .leave-text {
    font-size: 10px;
  }
  
  /* 字幕设置移动端样式 */
  .subtitle-settings {
    padding: 10px 12px;
    margin-bottom: 12px;
  }
  

  
  /* 通话按钮移动端样式 */
  .invoke-btn {
    width: 64px;
    height: 64px;
  }
  
  .invoke-btn img {
    width: 36px;
    height: 36px;
  }
  
  .invoke-icon {
    width: 20px;
    height: 20px;
  }
  
  .invoke-loading-icon {
    width: 20px;
    height: 20px;
  }
  
  .invoke-text {
    font-size: 12px;
  }
  
  .test-section {
    margin-top: 8px;
    padding-top: 8px;
  }
  
  .test-title {
    font-size: 11px;
    margin: 0 0 6px 0;
  }
  
  .test-buttons {
    gap: 3px;
  }
  
  .test-buttons .ant-btn {
    font-size: 9px;
    padding: 1px 4px;
  }
  
  .conversation-display {
    bottom: 70px;
    left: 10px;
    right: 10px;
  }
  
  .conversation-container {
    border-radius: 16px;
  }
  
  .conversation-header {
    padding: 12px 16px;
  }
  
  .conversation-title {
    font-size: 14px;
  }
  
  .conversation-controls {
    gap: 12px;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .subtitle-toggle-control {
    padding: 4px 8px;
  }
  
  .subtitle-label {
    font-size: 10px;
  }
  
  .conversation-stats {
    gap: 8px;
  }
  
  .stat-item {
    font-size: 10px;
  }
  
  /* 字幕部分移动端样式 */
  .subtitle-section {
    margin-top: 16px;
    padding-top: 12px;
  }
  
  .subtitle-section-header {
    margin-bottom: 8px;
  }
  
  .subtitle-section-title {
    font-size: 11px;
  }
  
  .subtitle-item {
    padding: 6px 10px;
    margin-bottom: 6px;
  }
  
  .subtitle-user {
    font-size: 10px;
  }
  
  .subtitle-text {
    font-size: 12px;
  }
  
  .subtitle-time {
    font-size: 9px;
  }
  
  .current-subtitle {
    padding: 6px 10px;
    margin-top: 6px;
  }
  
  .conversation-content {
    padding: 16px;
    max-height: 250px;
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
  
  .back-button {
    bottom: 10px;
    left: 10px;
    padding: 10px 16px;
    font-size: 12px;
  }
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

/* ========== 分析结果页面样式 ========== */
.analysis-result-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.analysis-result-container {
  width: 100%;
  max-width: 1000px;
}

.analysis-result-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.analysis-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  text-align: center;
  letter-spacing: -0.02em;
}

.analysis-subtitle {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin: 0 0 40px 0;
}

.domain-text, .role-text {
  font-weight: 600;
  color: #667eea;
}

.result-section {
  margin-bottom: 40px;
}

.result-section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.result-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
}

/* 雷达图卡片样式 */
.result-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.result-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

/* 雷达图部分 */
.radar-chart-section {
  display: flex;
  justify-content: center;
  margin: 24px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 分数详情 */
.scores-details {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* 分数网格 */
.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.scores-grid .score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.scores-grid .score-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.scores-grid .score-label {
  font-weight: 600;
  color: #333;
}

.scores-grid .score-value {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1em;
}

.issues-list, .suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.issue-item, .suggestion-item {
  background: rgba(102, 126, 234, 0.05);
  border-left: 4px solid #667eea;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

.issue-item:last-child, .suggestion-item:last-child {
  margin-bottom: 0;
}

.recommendation-category {
  margin-bottom: 24px;
}

.category-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #667eea;
}

.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendation-item {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-2px);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.home-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.home-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-2px);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .analysis-result-page {
    padding: 10px;
  }
  
  .analysis-result-card {
    padding: 20px;
    border-radius: 16px;
  }
  
  .analysis-title {
    font-size: 2rem;
  }
  
  .analysis-subtitle {
    font-size: 1rem;
  }
  
  .result-section-title {
    font-size: 1.4rem;
  }
  
  .issue-item, .suggestion-item {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-btn {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
  
  .result-card {
    padding: 16px;
    border-radius: 12px;
  }
  
  .radar-chart-section {
    padding: 16px;
    margin: 16px 0;
  }
  
  .scores-grid {
    grid-template-columns: 1fr;
  }
}
</style>